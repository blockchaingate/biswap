import { Injectable } from '@angular/core';
import SignClient from "@walletconnect/sign-client";
import { WalletConnectModal } from '@walletconnect/modal'
const projectId = "3acbabd1deb4672edfd4ca48226cfc0f";
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
const chainId = environment.production ? 211 : 212;
@Injectable({
  providedIn: 'root',
})
export class WalletService {
  session: any;
  client: any;
  account: string = '';
  topic: any;
  chainId: string = '';
  walletConnectModal: any;
  accountSubject = new Subject<string>();

  constructor(
  ) {}


  disconnect() {
    const address = '';
    this.account = address;
    this.accountSubject.next(address);
    this.client.disconnect({
      topic: this.topic,
      projectId,
      //relayUrl: 'wss://api.biswap.com',
      metadata: {
        name: "Biswap Dapp",
        description: "Automated FAB-based crypto exchange",
        url: "#",
        icons: ["https://walletconnect.com/walletconnect-logo.png"],
      }
    });
  }

  connectWalletSocket(param: any) {
    console.log('param===', JSON.stringify(param));
    this.chainId = param.Namespaces + ':' + param.chainId;
    console.log('this.chainId=', this.chainId);
    this.account = param.address;
    console.log('this.address=', this.account);
    this.accountSubject.next(param.address);
}


  async connectWalletNew() {
    console.log('connecting');
    /*
    if(this.client) {
      return;
    }
    */
    
    SignClient.init({
      projectId,
      //relayUrl: 'wss://api.biswap.com',
      metadata: {
        name: "Biswap Dapp",
        description: "Automated FAB-based crypto exchange",
        url: "#",
        icons: ["https://biswap.com/assets/images/biswap-256w.png"],
      }
    }).then(
      client => {
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
        this.showQrcode();
      }
    )

  
      
  }

  onSessionUpdate(updatedSession: any) {
    console.log('updatedSession===', updatedSession);
  }

  showQrcode() {
      console.log('showing');
      console.log('chainId===', chainId);
      this.client.connect({

        // Provide the namespaces and chains (e.g. `eip155` for EVM-based chains) we want to use in this session.
        requiredNamespaces: {
          eip155: {
            methods: [
              "kanban_sendTransaction"
            ],
            chains: ["eip155:" + chainId],
            events: [],
          },
        },
      }).then( (connected: any) => {
        console.log('connect in then');
        const { uri, approval } = connected;
        // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
        if (uri) {
  
          const walletConnectModal = new WalletConnectModal({
            projectId
          });
  
          this.walletConnectModal = walletConnectModal;
          walletConnectModal.openModal({ uri });
        }
        approval().then(
          (session: any) => {
            this.onSessionConnected(session);
          }
        );
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
    console.log('session===', session);
    //QRCodeModal.close();
    this.walletConnectModal.closeModal();
    const accounts = session.namespaces.eip155.accounts;
    console.log('accounts=',accounts);
    if(accounts && (accounts.length > 0)) {
      const account = accounts[0];
      const [namespace, reference, address] = account.split(":");
      this.chainId = namespace + ':' + reference;
      this.account = address;
      console.log('this.account=', this.account);
      this.accountSubject.next(address);
    }
  }

}


/*
accounts= ['eip155:212:0xdcd0f23125f74ef621dfa3310625f8af0dcd971b']
*/