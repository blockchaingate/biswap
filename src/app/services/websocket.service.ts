import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject, Observable, Observer } from "rxjs";
import { WebSocketSubject } from "rxjs/webSocket";
import { WalletService } from "src/app/services/wallet.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class SocketService {
  isSocketActive: boolean = false;
  txHashes: any = [];
  socket: any;
  private socketConnection = new BehaviorSubject([]);
  currentPrices = this.socketConnection.asObservable();

  constructor(
    private snackBar: MatSnackBar,
    public walletService: WalletService
  ) {}

  public connectSocket(): any {
    let currentUrl = window.location.href;
    const urlParams = new URLSearchParams(currentUrl);
    const value = urlParams.get("deviceId");

    if (value != null) {
      this.isSocketActive = true;

      // this.socket = new WebSocketSubject("ws://localhost:3000/ws/paycool@69FC8EC9-7F77-46EB-9445-522229F98771");
      this.socket = new WebSocketSubject(environment.webSocket.dp + value);

      this.socket.subscribe((data: any) => {
        // var data = JSON.stringify(param);

        try {
          if (data["source"] != null) {
            let str = data["source"];
            let parts = str.split("-");
            let secondPart = parts[1];
            if (secondPart == "connect") {
              this.walletService.connectWalletSocket(data["data"][0]);
            } else if (secondPart == "result") {
              let str = data["data"]; // "paycool-connect"

              const baseUrl = environment.production
                ? "https://www.exchangily.com"
                : "https://test.exchangily.com";

              this.txHashes.push(baseUrl + "/explorer/tx-detail/" + str);

              this.showSnackBar(this.txHashes);
            }
          }
          return new Observable((observer: Observer<any>) => {
            this.socket.on("message", (data: any) => observer.next(data));
          });
        } catch (error) {
          return new Observable((observer: Observer<any>) => {
            this.socket.on("message", (data: any) => observer.next(data));
          });
        }
      });
    }
  }

  public sendMessage(param: any): void {
    this.socket.next(param);
  }

  public showSnackBar(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 100000,
    });
  }

  public getResult(): any {
    return this.txHashes;
  }
}
