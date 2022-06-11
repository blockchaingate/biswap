import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from './data.service';
import { StorageService } from './storage.service';
import WalletConnectClient, { CLIENT_EVENTS } from '@walletconnect/client';
import { WalletModel } from '../models/wallet.model';
import { PairingTypes } from '@walletconnect/types';
import QRCodeModal from '@walletconnect/qrcode-modal';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  session: any;
  client: any;
  account: string;
  accountSubject = new Subject<string>();

  walletModel: WalletModel = new WalletModel();

  constructor(
    private ngxService: NgxUiLoaderService,
    public dataService: DataService,
    public storageService: StorageService,
    public dialog: MatDialog
  ) {}


  async createConnection() {
    this.walletModel.client = await WalletConnectClient.init({
      logger: 'debug',
      projectId: '3acbabd1deb4672edfd4ca48226cfc0f',
      relayUrl: 'wss://relay.walletconnect.com',
      metadata: {
        name: 'Biswap Dapp',
        description: 'Biswap Dapp',
        url: 'http://localhost:4200',
        icons: ['https://walletconnect.com/walletconnect-logo.png'],
      },
    });
    var session = await this.showQrCode().finally(() => {
    });
    return session;
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
          this.ngxService.stop();
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
    this.onSessionConnected(session);
    return session;
  }

  onSessionConnected(session: any) {
    this.walletModel.session = session;
    QRCodeModal.close();
    this.ngxService.stop();
    const accounts = session.state.accounts;
    if (accounts && accounts.length > 0) {
      this.walletModel.account = accounts[0];
    }
    this.storageService.createWalletSession(session);
    console.log('this.walletModel.client', this.walletModel.client);
    this.dataService.setWalletClient(this.walletModel.client);
  }

  async connectWallet() {
    const clientSession = this.storageService.getWalletSession();
    console.log('clientSession===', clientSession);
    if (clientSession == null || clientSession == undefined) {
      this.ngxService.start();
      var session = await this.createConnection();
      if(session != null){
        this.dataService.sendWalletLabel('Disconnect Wallet');
        this.dataService.setIsWalletConnect(true);
        return true;
      }else{
        return false;
      }
    } else {
      this.dataService.sendWalletLabel('Connect Wallet');
      this.storageService.removeWalletSession();
      this.dataService.setIsWalletConnect(false);
      return false;
    }    
  }

  connectWalletNew() {
    console.log('connecting');
    WalletConnectClient.init({
      logger: 'debug',
      projectId: '3acbabd1deb4672edfd4ca48226cfc0f',
      relayUrl: 'wss://relay.walletconnect.com',
      metadata: {
        name: 'Biswap Dapp',
        description: 'Biswap Dapp',
        url: 'http://localhost:4200',
        icons: ['https://walletconnect.com/walletconnect-logo.png'],
      },
    }).then(
      (client) => {
        console.log('client=', client);
        this.client = client;
        client.on(
          CLIENT_EVENTS.pairing.proposal,
          (proposal: PairingTypes.Proposal) => {
            const { uri } = proposal.signal.params;
            //this.walletModel.uri = uri;
            QRCodeModal.open(uri, () => {
              console.log('EVENT', 'QR Code Modal closed');

            });
          }
        );
        //client.disconnect
        client.connect({
          permissions: {
            blockchain: {
              chains: ['eip155:fab'],
            },
            jsonrpc: {
              methods: ['kanban_sendTransaction'],
            },
          },
        }).then(session => {
          console.log('session=', session);
          this.onSessionConnectedNew(session);
        });
      }
    );
  }

  onSessionConnectedNew(session: any) {
    this.session = session;
    QRCodeModal.close();
    const accounts = session.state.accounts;
    if(accounts && (accounts.length > 0)) {
      const account = accounts[0];
      const address = account.split(':')[2];
      this.account = address;
      this.accountSubject.next(address);
    }
  }
}
