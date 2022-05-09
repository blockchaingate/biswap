import { Component, OnInit } from '@angular/core';
import WalletConnectClient from '@walletconnect/client';
import { CLIENT_EVENTS } from '@walletconnect/client';
import { PairingTypes } from '@walletconnect/types';
import QRCodeModal from '@walletconnect/qrcode-modal';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
  chainId: number;
  account: string;
  to: string;
  toExample: string;
  dataExample: string;
  value: number;
  data: string;
  session: any;
  txid: string;
  result: any;
  client: any;
  uri: string;

  constructor(public storageService: StorageService) {}

  async ngOnInit() {
    var clientSession = this.storageService.getWalletSession();

    if (!clientSession) {
      this.client = await WalletConnectClient.init({
        logger: 'debug',
        projectId: '3acbabd1deb4672edfd4ca48226cfc0f',
        relayUrl: 'wss://relay.walletconnect.com',
        metadata: {
          name: 'Example Dapp',
          description: 'Example Dapp',
          url: 'http://localhost:4200',
          icons: ['https://walletconnect.com/walletconnect-logo.png'],
        },
      });
    } else {
      this.onSessionConnected(JSON.parse(clientSession));
    }
  }

  async showQrCode() {
    this.client.on(
      CLIENT_EVENTS.pairing.proposal,
      async (proposal: PairingTypes.Proposal) => {
        const { uri } = proposal.signal.params;
        this.uri = uri;
        QRCodeModal.open(uri, () => {
          console.log('EVENT', 'QR Code Modal closed');
        });
      }
    );
    const session = await this.client.connect({
      permissions: {
        blockchain: {
          chains: ['eip155:fab'],
        },
        jsonrpc: {
          methods: ['kanban_sendTransaction'],
        },
      },
    });
    this.storageService.createWalletSession(session);
    this.onSessionConnected(session);
  }

  onSessionConnected(session: any) {
    this.session = session;
    QRCodeModal.close();
    const accounts = session.state.accounts;
    if (accounts && accounts.length > 0) {
      this.account = accounts[0];
    }
  }

  async send() {
    const tx = {
      to: this.to,
      value: this.value,
      data: this.data,
    };
    const requestBody = {
      topic: this.session.topic,
      chainId: this.session.permissions.blockchain.chains[0],
      request: {
        method: 'kanban_sendTransaction',
        params: [tx],
      },
    };
    const result = await this.client.request(requestBody);
    this.result = result;
  }
}
