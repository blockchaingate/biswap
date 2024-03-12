import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { WalletService } from 'src/app/services/wallet.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class SocketService {
  socket: any;
  private socketConnection = new BehaviorSubject([]);
  currentPrices = this.socketConnection.asObservable();

  constructor(
    private snackBar: MatSnackBar,
    public walletService: WalletService
  ) {
  }

  public connectSocket(): any {


    let currentUrl = window.location.href;
    const urlParams = new URLSearchParams(currentUrl);
    const value = urlParams.get('deviceId') ?? "webDapp";

    console.log('===============0=========== > value', value);

    // this.socket = new WebSocketSubject("ws://localhost:3000/ws/paycool@69FC8EC9-7F77-46EB-9445-522229F98771");
    this.socket = new WebSocketSubject(environment.webSocket.dp+value);

    this.socket.subscribe((data: any) => {

      // var data = JSON.stringify(param);

      try {
        if(data["source"] != null){
          let str = data["source"]; 
          let parts = str.split("-"); 
          let secondPart = parts[1]; 
          if(secondPart == "connect") {
            console.log('========================== > connect', secondPart);
            this.walletService.connectWalletSocket(
              data["data"][0]
            );
          } else if(secondPart == "result") {
            let str = data["data"]; // "paycool-connect"
            console.log('========================== > result', str);
              this.showSnackBar(JSON.stringify(str) );
                }
        }
              return new Observable((observer: Observer<any>) => {
                      this.socket.on('message', (data: any) => observer.next(data));
                    });
        
      } catch (error) {

        return new Observable((observer: Observer<any>) => {
          this.socket.on('message', (data: any) => observer.next(data));
        });
        
      }

   
    
    });
  }


  public sendMessage(param: any): void {
    console.log('========================== > sending message');
    this.socket.next(param);
  }

public showSnackBar(message: string): void {
  this.snackBar.open(message, 'Close', {
    duration: 25000,
  });
}
}
