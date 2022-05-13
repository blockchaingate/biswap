import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from './data.service';
import { StorageService } from './storage.service';
import WalletConnectClient, { CLIENT_EVENTS } from '@walletconnect/client';
import { WalletModel } from '../models/wallet.model';
import { PairingTypes } from '@walletconnect/types';
import QRCodeModal from '@walletconnect/qrcode-modal';

@Injectable({
  providedIn: 'root',
})
export class WalletService {

  walletModel: WalletModel = new WalletModel();
     
  constructor(
      public dataService: DataService,
      public storageService: StorageService,
      public dialog: MatDialog
  ) {}

  async createConnection() {
    // var clientSession = this.storageService.getWalletSession();

    // console.log('clientSession');
    // console.log(clientSession);
    // if (clientSession == null) {
      this.walletModel.client = await WalletConnectClient.init({
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
      await this.showQrCode();
      console.log('this.walletModel.client' , this.walletModel.client);
      this.dataService.setWalletClient(this.walletModel.client);
    // } else {
    //   this.onSessionConnected(JSON.parse(clientSession));
    // }
  }

  async showQrCode() {
    this.walletModel.client.on(
      CLIENT_EVENTS.pairing.proposal,
      async (proposal: PairingTypes.Proposal) => {
        const { uri } = proposal.signal.params;
        this.walletModel.uri = uri;
        QRCodeModal.open(uri, () => {
          console.log('EVENT', 'QR Code Modal closed');
          this.dataService.sendWalletLabel('Connect Wallet');
          this.dataService.setIsWalletConnect(false);
        });
      }
    );
    const session = await this.walletModel.client.connect({
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
    this.walletModel.session = session;
    QRCodeModal.close();
    const accounts = session.state.accounts;
    if (accounts && accounts.length > 0) {
      this.walletModel.account = accounts[0];
    }
  }

  connectWallet() {
    var clientSession = this.storageService.getWalletSession();
    if(clientSession == null || clientSession == undefined){
      this.createConnection();
      this.dataService.sendWalletLabel('Disconnect Wallet');
      this.dataService.setIsWalletConnect(true);

    }else{
    this.dataService.sendWalletLabel('Connect Wallet');
      this.storageService.removeWalletSession();
      this.dataService.setIsWalletConnect(false);
    }
  }
}
