import { Injectable } from "@angular/core";
import SignClient from "@walletconnect/sign-client";
import { WalletConnectModal } from "@walletconnect/modal";
const projectId = "3acbabd1deb4672edfd4ca48226cfc0f";
import { BehaviorSubject, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { ConnectService } from "src/app/services/connect.service";
const chainId = environment.production ? 211 : 212;
@Injectable({
  providedIn: "root",
})
export class WalletService {
  session: any;
  client: any;
  account: string = "";
  topic: any;
  chainId: string = "";
  walletConnectModal: any;
  accountSubject = new BehaviorSubject<string>("");

  constructor(private connectService: ConnectService) {
    this.connectService.currentAddress.subscribe((address) => {
      if (address) {
        this.setExternalAddress(address);
      } else if (this.account && !this.session) {
        this.setExternalAddress('');
      }
    });
  }

  setExternalAddress(address: string) {
    this.account = address || "";
    if (address && !this.chainId) {
      this.chainId = `eip155:${chainId}`;
    }
    this.accountSubject.next(this.account);
  }

  disconnect() {
    this.account = "";
    this.accountSubject.next("");
    if (!this.client || !this.topic) {
      this.session = null;
      this.chainId = "";
      return;
    }
    try {
      this.client.disconnect({
        topic: this.topic,
        projectId,
        //relayUrl: 'wss://api.biswap.com',
        metadata: {
          name: "Biswap Dapp",
          description: "Automated FAB-based crypto exchange",
          url: "#",
          icons: ["https://walletconnect.com/walletconnect-logo.png"],
        },
      });
    } catch (error) {
      console.warn("Wallet disconnect failed:", error);
    }
  }

  connectWalletSocket(param: any) {
    this.chainId = param.Namespaces + ":" + param.chainId;
    this.account = param.address;
    this.accountSubject.next(param.address);
  }

  async connectWalletNew() {
    SignClient.init({
      projectId,
      metadata: {
        name: "Biswap Dapp",
        description: "Automated FAB-based crypto exchange",
        url: "#",
        icons: ["https://biswap.com/assets/images/biswap-256w.png"],
      },
    }).then((client) => {
      this.client = client;

      client.on("session_event", (args) => {
        const id = args.id;
        const ddd = args.params;
        const topic = args.topic;
        this.topic = topic;

        // Handle session events, such as "chainChanged", "accountsChanged", etc.
      });

      client.on("session_update", ({ topic, params }) => {
        const { namespaces } = params;
        const _session = client.session.get(topic);
        // Overwrite the `namespaces` of the existing session with the incoming one.
        const updatedSession = { ..._session, namespaces };
        // Integrate the updated session state into your dapp state.
        this.onSessionUpdate(updatedSession);
      });

      client.on("session_delete", () => {
        this.disconnect();
      });
      this.showQrcode();
    });
  }

  onSessionUpdate(updatedSession: any) {
  }

  showQrcode() {
    this.client
      .connect({
        // Provide the namespaces and chains (e.g. `eip155` for EVM-based chains) we want to use in this session.
        requiredNamespaces: {
          eip155: {
            methods: ["kanban_sendTransaction"],
            chains: ["eip155:" + chainId],
            events: [],
          },
        },
      })
      .then(
        (connected: any) => {
          const { uri, approval } = connected;
          // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
          if (uri) {
            const walletConnectModal = new WalletConnectModal({
              projectId,
            });

            this.walletConnectModal = walletConnectModal;
            walletConnectModal.openModal({ uri });
          }
          approval().then((session: any) => {
            this.onSessionConnected(session);
          });
        },
        (error: any) => {
          this.walletConnectModal.closeModal();
        }
      );

    /*
        QRCodeModal.open(uri, () => {
          console.log("EVENT", "QR Code Modal closed");
        });
        */

    // Await session approval from the wallet.
    //const session = await approval();
    // Handle the returned session (e.g. update UI to "connected" state).
  }

  onSessionConnected(session: any) {
    this.session = session;
    this.walletConnectModal.closeModal();
    const accounts = session.namespaces.eip155.accounts;
    this.topic = session.topic;
    if (accounts && accounts.length > 0) {
      const account = accounts[0];
      const [namespace, reference, address] = account.split(":");
      this.chainId = namespace + ":" + reference;
      this.account = address;
      this.accountSubject.next(address);
    }
  }
}

/*
accounts= ['eip155:212:0xdcd0f23125f74ef621dfa3310625f8af0dcd971b']
*/
