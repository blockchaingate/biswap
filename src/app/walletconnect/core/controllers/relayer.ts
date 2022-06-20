import pino, { Logger } from "pino";
import { EventEmitter } from "events";
import { JsonRpcProvider } from "@walletconnect/jsonrpc-provider";
import {
  formatJsonRpcResult,
  IJsonRpcProvider,
  isJsonRpcRequest,
  JsonRpcPayload,
  JsonRpcRequest,
} from "@walletconnect/jsonrpc-utils";
import WsConnection from "@walletconnect/jsonrpc-ws-connection";
import {
  generateChildLogger,
  getDefaultLoggerOptions,
  getLoggerContext,
} from "@walletconnect/logger";
import { RelayJsonRpc } from "@walletconnect/relay-api";
import { toMiliseconds } from "@walletconnect/time";
import {
  ICore,
  IMessageTracker,
  IPublisher,
  IRelayer,
  ISubscriber,
  RelayerOptions,
  RelayerTypes,
} from "@walletconnect/types";
import { formatRelayRpcUrl, ERROR } from "@walletconnect/utils";

import {
  RELAYER_CONTEXT,
  RELAYER_DEFAULT_LOGGER,
  RELAYER_DEFAULT_RELAY_URL,
  RELAYER_EVENTS,
  RELAYER_PROVIDER_EVENTS,
  RELAYER_RECONNECT_TIMEOUT,
  RELAYER_SUBSCRIBER_SUFFIX,
} from "../constants";
import { MessageTracker } from "./messages";
import { Publisher } from "./publisher";
import { Subscriber } from "./subscriber";

export class Relayer extends IRelayer {
  public readonly protocol = "irn";
  public readonly version = 1;

  public core: ICore;
  public logger: Logger;
  public events = new EventEmitter();
  public provider: IJsonRpcProvider;
  public messages: IMessageTracker;
  public subscriber: ISubscriber;
  public publisher: IPublisher;
  public name = RELAYER_CONTEXT;

  private initialized = false;

  constructor(opts: RelayerOptions) {
    super(opts);
    this.core = opts.core;
    this.logger =
      typeof opts.logger !== "undefined" && typeof opts.logger !== "string"
        ? generateChildLogger(opts.logger, this.name)
        : pino(getDefaultLoggerOptions({ level: opts.logger || RELAYER_DEFAULT_LOGGER }));
    const rpcUrl =
      opts.rpcUrl ||
      formatRelayRpcUrl(this.protocol, this.version, RELAYER_DEFAULT_RELAY_URL, opts.projectId);
    this.provider =
      typeof opts.relayProvider !== "string" && typeof opts.relayProvider !== "undefined"
        ? opts.relayProvider
        : new JsonRpcProvider(new WsConnection(rpcUrl));
    this.messages = new MessageTracker(this.logger, opts.core);
    this.subscriber = new Subscriber(this, this.logger);
    this.publisher = new Publisher(this, this.logger);
  }

  public async init() {
    this.logger.trace(`Initialized`);
    console.log('relayer init');
    //await Promise.all([this.messages.init(), this.provider.connect(), this.subscriber.init()]);
    
    console.log('o1');
    await this.messages.init();
    console.log('o2');
    await this.provider.connect();
    console.log('o3');
    await this.subscriber.init();
    
    console.log('relayer init end');
    this.registerEventListeners();
    this.initialized = true;
  }

  get context() {
    return getLoggerContext(this.logger);
  }

  get connected() {
    return this.provider.connection.connected;
  }

  get connecting() {
    return this.provider.connection.connecting;
  }

  public async publish(topic: string, message: string, opts?: RelayerTypes.PublishOptions) {
    this.isInitialized();
    await this.publisher.publish(topic, message, opts);
    await this.recordMessageEvent({ topic, message });
  }

  public async subscribe(topic: string, opts?: RelayerTypes.SubscribeOptions) {
    this.isInitialized();
    const id = await this.subscriber.subscribe(topic, opts);
    return id;
  }

  public async unsubscribe(topic: string, opts?: RelayerTypes.UnsubscribeOptions) {
    this.isInitialized();
    await this.subscriber.unsubscribe(topic, opts);
  }

  public on(event: string, listener: any) {
    this.events.on(event, listener);
  }

  public once(event: string, listener: any) {
    this.events.once(event, listener);
  }

  public off(event: string, listener: any) {
    this.events.off(event, listener);
  }

  public removeListener(event: string, listener: any) {
    this.events.removeListener(event, listener);
  }

  // ---------- Private ----------------------------------------------- //

  private async recordMessageEvent(messageEvent: RelayerTypes.MessageEvent) {
    const { topic, message } = messageEvent;
    await this.messages.set(topic, message);
  }

  private shouldIgnoreMessageEvent(messageEvent: RelayerTypes.MessageEvent) {
    const { topic, message } = messageEvent;
    if (!this.subscriber.topics.includes(topic)) return true;
    const exists = this.messages.has(topic, message);
    return exists;
  }

  private async onProviderPayload(payload: JsonRpcPayload) {
    this.logger.debug(`Incoming Relay Payload`);
    this.logger.trace({ type: "payload", direction: "incoming", payload });
    if (isJsonRpcRequest(payload)) {
      if (!payload.method.endsWith(RELAYER_SUBSCRIBER_SUFFIX)) return;
      const event = (payload as JsonRpcRequest<RelayJsonRpc.SubscriptionParams>).params;
      const { topic, message } = event.data;
      const messageEvent = { topic, message } as RelayerTypes.MessageEvent;
      this.logger.debug(`Emitting Relayer Payload`);
      this.logger.trace({ type: "event", event: event.id, ...messageEvent });
      this.events.emit(event.id, messageEvent);
      await this.acknowledgePayload(payload);
      await this.onMessageEvent(messageEvent);
    }
  }

  private async onMessageEvent(messageEvent: RelayerTypes.MessageEvent) {
    if (this.shouldIgnoreMessageEvent(messageEvent)) return;
    this.events.emit(RELAYER_EVENTS.message, messageEvent);
    await this.recordMessageEvent(messageEvent);
  }

  private async acknowledgePayload(payload: JsonRpcPayload) {
    const response = formatJsonRpcResult(payload.id, true);
    await this.provider.connection.send(response);
  }

  private registerEventListeners() {
    this.provider.on(RELAYER_PROVIDER_EVENTS.payload, (payload: JsonRpcPayload) =>
      this.onProviderPayload(payload),
    );
    this.provider.on(RELAYER_PROVIDER_EVENTS.connect, () => {
      this.events.emit(RELAYER_EVENTS.connect);
    });
    this.provider.on(RELAYER_PROVIDER_EVENTS.disconnect, () => {
      this.events.emit(RELAYER_EVENTS.disconnect);
      // Attempt reconnection after one second.
      setTimeout(() => {
        this.provider.connect();
      }, toMiliseconds(RELAYER_RECONNECT_TIMEOUT));
    });
    this.provider.on(RELAYER_PROVIDER_EVENTS.error, (err: unknown) =>
      this.events.emit(RELAYER_EVENTS.error, err),
    );
  }

  private isInitialized() {
    if (!this.initialized) {
      throw new Error(ERROR.NOT_INITIALIZED.stringify(this.name));
    }
  }
}
