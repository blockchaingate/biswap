import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from './data.service';
import { StorageService } from './storage.service';
import SignClient from "../walletconnect/sign-client";
import { WalletModel } from '../models/wallet.model';
import QRCodeModal from '@walletconnect/qrcode-modal';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class WalletService {
  session: any;
  client: any;
  account: string;
  topic: any;
  chainId: string;
  accountSubject = new Subject<string>();

  walletModel: WalletModel = new WalletModel();

  constructor(
    public dataService: DataService,
    public storageService: StorageService,
    public dialog: MatDialog
  ) {}


  disconnect() {
    console.log('disconnectinggggg');
    const address = '';
    this.account = address;
    this.accountSubject.next(address);
    this.client.disconnect({
      topic: this.topic,
      projectId: "3acbabd1deb4672edfd4ca48226cfc0f",
      metadata: {
        name: "Biswap Dapp",
        description: "Automated FAB-based crypto exchange",
        url: "#",
        icons: ["https://walletconnect.com/walletconnect-logo.png"],
      }
    });
  }
  async connectWalletNew() {
    console.log('connecting');
    /*
    if(this.client) {
      return;
    }
    */
    
    const client = await SignClient.init({
      projectId: "3acbabd1deb4672edfd4ca48226cfc0f",
      metadata: {
        name: "Biswap Dapp",
        description: "Automated FAB-based crypto exchange",
        url: "#",
        icons: ["https://walletconnect.com/walletconnect-logo.png"],
      }
    });

    this.client = client;

    client.on("session_event", (args) => {
         const id = args.id;
         const ddd = args.params;
         const topic = args.topic;
         this.topic = topic;
         console.log('id===', id);
        // Handle session events, such as "chainChanged", "accountsChanged", etc.
        
    });
      
    client.on("session_update", ({ topic, params }) => {
      console.log('topic===', topic);
        const { namespaces } = params;
        const _session = client.session.get(topic);
        // Overwrite the `namespaces` of the existing session with the incoming one.
        const updatedSession = { ..._session, namespaces };
        // Integrate the updated session state into your dapp state.
        this.onSessionUpdate(updatedSession);
    });
      
    client.on("session_delete", () => {
        // Session was deleted -> reset the dapp state, clean up from user session, etc.
    });    
      

    await this.showQrcode();
  }

  onSessionUpdate(updatedSession: any) {
    console.log('updatedSession===', updatedSession);
  }

  async showQrcode() {
    try {
      const { uri, approval } = await this.client.connect({

        // Provide the namespaces and chains (e.g. `eip155` for EVM-based chains) we want to use in this session.
        requiredNamespaces: {
          eip155: {
            methods: [
              "kanban_sendTransaction"
            ],
            chains: ["eip155:fab"],
            events: [],
          },
        },
      });
    
      // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
      if (uri) {
        QRCodeModal.open(uri, () => {
          console.log("EVENT", "QR Code Modal closed");
        });
      }
    
      // Await session approval from the wallet.
      const session = await approval();
      // Handle the returned session (e.g. update UI to "connected" state).
      await this.onSessionConnected(session);
    } catch (e) {
      console.error(e);
    } finally {
      // Close the QRCode modal in case it was open.
      QRCodeModal.close();
    }
  }


  onSessionConnected(session: any) {
    this.session = session;
    console.log('session===', session);
    QRCodeModal.close();
    const accounts = session.namespaces.eip155.accounts;
    console.log('accounts=',accounts);
    if(accounts && (accounts.length > 0)) {
      const account = accounts[0];
      const [namespace, reference, address] = account.split(":");
      this.chainId = namespace + ':' + reference;
      this.account = address;
      this.accountSubject.next(address);
    }
  }
  /*
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
  */
}
