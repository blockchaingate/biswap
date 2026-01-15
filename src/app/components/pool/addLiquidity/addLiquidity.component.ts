import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import BigNumber from "bignumber.js";
import { ErrorMessagesComponent } from "src/app/components/errorMessages/errorMessages.component";
import { Coin } from "src/app/models/coin";
import { TimestampModel } from "src/app/models/temistampModel";
import { ApiService } from "src/app/services/api.services";
import { DataService } from "src/app/services/data.service";
import { KanbanMiddlewareService } from "src/app/services/kanban.middleware.service";
import { KanbanService } from "src/app/services/kanban.service";
import { UtilsService } from "src/app/services/utils.service";
import { WalletService } from "src/app/services/wallet.service";
import { Web3Service } from "src/app/services/web3.service";
import { environment } from "src/environments/environment";
import { TokenListComponent } from "../../shared/tokenList/tokenList.component";
import { SettingsComponent } from "../../settings/settings.component";
import { BiswapService } from "src/app/services/biswap.service";
import { AlertComponent } from "../../shared/alert/alert.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ConnectService } from "src/app/services/connect.service";
//import { send } from "cool-connect";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { StorageService } from "src/app/services/storage.service";
import { Subscription } from "rxjs";

import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-addLiquidity",
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatCardModule, MatIconModule, MatButtonModule, TranslateModule, DecimalPipe],
  templateUrl: "./addLiquidity.component.html",
  styleUrls: ["./addLiquidity.component.scss"],
})
export class AddLiquidityComponent implements OnInit, OnDestroy {
  slippage = 1;
  deadline = 20;
  error: string = "";
  _firstToken!: Coin;
  _secondToken!: Coin;
  insufficientFund: boolean = false;
  item: any;

  public get firstToken(): Coin {
    return this._firstToken;
  }

  public set firstToken(coin: Coin) {
    this._firstToken = coin;
    const id = coin.id;
    if (this.account && id) {
      this.kanbanService
        .getTokenBalance(this.account, id)
        .subscribe((balance: any) => {
          this.firstCoinBalance = balance;
          this.cdr.detectChanges();
        });
    }
  }

  public get secondToken(): Coin {
    return this._secondToken;
  }

  public set secondToken(coin: Coin) {
    this._secondToken = coin;
    const id = coin.id;
    if (this.account && id) {
      this.kanbanService
        .getTokenBalance(this.account, id)
        .subscribe((balance: any) => {
          this.secondCoinBalance = balance;
          this.cdr.detectChanges();
        });
    }
  }

  tokenList: Coin[] = [];
  isWalletConnect: boolean = true;
  firstCoinAmount!: number;
  secondCoinAmount!: number;
  _account: string = "";

  public get account(): string {
    return this._account;
  }

  public set account(newAccount: string) {
    this._account = newAccount;
    if (newAccount) {
      if (this.firstToken && this.firstToken.id) {
        this.kanbanService
          .getTokenBalance(newAccount, this.firstToken.id)
          .subscribe((balance: any) => {
            this.firstCoinBalance = balance;
            this.cdr.detectChanges();
          });
      }

      if (this.secondToken && this.secondToken.id) {
        this.kanbanService
          .getTokenBalance(newAccount, this.secondToken.id)
          .subscribe((balance: any) => {
            this.secondCoinBalance = balance;
            this.cdr.detectChanges();
          });
      }
    }
    this.checkLiquidity();
  }

  perAmount: number = 0;
  perAmountLabel: string = "";

  txHashes: any = [];
  newPair: String = "";
  private txSubscription?: Subscription;

  isNewPair: boolean = false;

  firstTokenReserve: BigNumber = new BigNumber(0);
  secondTokenReserve: BigNumber = new BigNumber(0);

  secondCoinBalance!: number;
  firstCoinBalance!: number;
  firstTokenTotalLiquidity: number = 0;
  secondTokenTotalLiquidity: number = 0;

  //walletAddress:string;
  _pairAddress: string = "";

  get pairAddress(): string {
    return this._pairAddress;
  }

  set pairAddress(_pairAddress: string) {
    this._pairAddress = _pairAddress;
    this.checkLiquidity();
  }

  constructor(
    private kanbanMiddlewareService: KanbanMiddlewareService,
    private utilService: UtilsService,
    private web3Service: Web3Service,
    private dataService: DataService,
    public dialog: MatDialog,
    private biswapServ: BiswapService,
    private kanbanService: KanbanService,
    private walletService: WalletService,
    private currentRoute: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    private storage: StorageService,
    private apiService: ApiService,
    private connectServ: ConnectService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.firstToken = new Coin();
    this.secondToken = new Coin();

    this.secondCoinBalance = -1;
    this.firstCoinBalance = -1;

    this.account = this.walletService.account;
    if (!this.account) {
      this.walletService.accountSubject.subscribe((account) => {
        this.account = account;
      });
    }
    this.dataService.GettokenList.subscribe((x) => {
      this.tokenList = x;
    });
    this.txSubscription = this.connectServ.currentTxid.subscribe((txid) => {
      if (txid) {
        this.refresh();
      }
    });
    this.checkUrlToken();
  }

  checkLiquidity() {
    if (!this.account || !this.pairAddress) {
      return;
    }
    this.biswapServ
      .getLiquidity(this.account, this.pairAddress)
      .subscribe((item: any) => {
        if (item && !item.error) {
          this.item = item;
        }
      });
  }

  openSettings() {
    const dialogRef = this.dialog.open(SettingsComponent, {
      width: "250px",
      data: { slippage: this.slippage, deadline: this.deadline },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.slippage = result.slippage;
        this.deadline = result.deadline;
      }
    });
  }

  checkUrlToken() {
    this.currentRoute.params.subscribe((x) => {
      var type = this.router.url.split("/");
      if (type[3] == "token") {
        let params: any = x;
        this.apiService
          .getTokenInfoFromId(params.tokenid)
          .subscribe((res: any) => {
            if (res) {
              let first = res["name"];
              this.firstToken =
                this.tokenList.find((x) => x.symbol == first) || new Coin();
            }
          });
      } else if (x['tokenid']) {
        let params: any = x;
        this.apiService
          .getTokensInfoFromPair(params['tokenid'])
          .subscribe((res: any) => {
            if (res) {
              let first = res["token0Name"];
              let sescond = res["token1Name"];
              this.firstToken = this.tokenList.find((x) => x.symbol == first) || new Coin();
              this.secondToken = this.tokenList.find((x) => x.symbol == sescond) || new Coin();
            }
          });
      }
    });
  }

  async onKey(value: number, isFistToken: boolean) {
    if (
      this.firstToken.symbol != null &&
      this.secondToken.symbol != null &&
      value != null &&
      value != undefined &&
      !this.isNewPair
    ) {
      await this.setInputValues(isFistToken);
    } else if (value == null && value == undefined && !this.isNewPair) {
      if (isFistToken) {
        this.secondCoinAmount = 0;
      } else {
        this.firstCoinAmount = 0;
      }
    } else if (this.isNewPair) {
      if (!isFistToken) {
        this.secondCoinAmount = value;
      } else {
        this.firstCoinAmount = value;
      }
    }
  }

  async setInputValues(isFirst: boolean) {
    if (!this.perAmount) {
      return;
    }
    //var reserve1 = new BigNumber(this.firstTokenReserve).shiftedBy(-this.firstToken.decimals).toNumber();
    //var reserve2 = new BigNumber(this.secondTokenReserve).shiftedBy(-this.secondToken.decimals).toNumber();

    if (isFirst) {
      this.secondCoinAmount = new BigNumber(this.firstCoinAmount)
        .dividedBy(new BigNumber(this.perAmount))
        .toNumber();
    } else {
      this.firstCoinAmount = new BigNumber(this.secondCoinAmount)
        .multipliedBy(new BigNumber(this.perAmount))
        .toNumber();
    }
  }

  openDialog(errorMessage: String) {
    this.dialog.open(ErrorMessagesComponent, { data: errorMessage });
  }

  kanbanCallMethod() {
    if (!this.firstToken.id || !this.secondToken.id) {
      return;
    }
    var params = [this.firstToken.id, this.secondToken.id];
    var abiHex = this.web3Service.getPair(params);
    this.kanbanService
      .kanbanCall(environment.smartConractAdressFactory, abiHex)
      .subscribe((data1) => {
        let res: any = data1;
        const addeess = this.web3Service.decodeabiHex(res.data, "address") as string;
        if (addeess.toString() != "0x0000000000000000000000000000000000000000") {
          this.pairAddress = addeess.toString();
          var abiHexa = this.web3Service.getReserves();
          this.kanbanService
            .kanbanCall(addeess.toString(), abiHexa)
            .subscribe((data3) => {
              var param = ["uint112", "uint112", "uint32"];
              let res: any = data3;
              var value = this.web3Service.decodeabiHexs(res.data, param);
              let firstTokenDecimals = this.firstToken.decimals;
              let secondDecimals = this.secondToken.decimals;
              if (this.firstToken.id < this.secondToken.id) {
                this.firstTokenReserve = new BigNumber(value[0] as string | number);
                this.secondTokenReserve = new BigNumber(value[1] as string | number);
              } else {
                this.firstTokenReserve = new BigNumber(value[1] as string | number);
                this.secondTokenReserve = new BigNumber(value[0] as string | number);
              }

              this.firstTokenTotalLiquidity = this.firstTokenReserve.shiftedBy(-firstTokenDecimals).toNumber();
              this.secondTokenTotalLiquidity = this.secondTokenReserve.shiftedBy(-secondDecimals).toNumber();

              var perAmount = new BigNumber(this.firstTokenReserve)
                .shiftedBy(-firstTokenDecimals)
                .dividedBy(
                  new BigNumber(this.secondTokenReserve).shiftedBy(
                    -secondDecimals
                  )
                )
                .toNumber();

              this.perAmountLabel =
                this.firstToken.symbol + " per " + this.secondToken.symbol;

              this.perAmount = perAmount;
              this.cdr.detectChanges();
            });
          this.isNewPair = false;
          this.newPair = "";
        } else {
          this.newPair = "You are adding liquidity to new pair";
          this.isNewPair = true;
        }
      });
  }

  openFirstTokenListDialog() {
    this.dialog
      .open(TokenListComponent, {
        data: {
          tokens: this.tokenList,
          isFirst: true,
        },
      })
      .afterClosed()
      .subscribe((x) => {
        if (x.isFirst) {
          this.dataService.GetFirstToken.subscribe((data) => {
            this.firstToken = data;
          });
        }
        if (this.firstToken.id != null && this.secondToken.id != null) {
          this.kanbanCallMethod();
        }
      });
  }

  connectWallet() {
    this.walletService.connectWalletNew();
  }

  openSecondTokenListDialog() {
    this.dialog
      .open(TokenListComponent, {
        data: {
          tokens: this.tokenList,
          isSecond: true,
        },
      })
      .afterClosed()
      .subscribe((x) => {
        if (x.isSecond) {
          this.dataService.GetSecondToken.subscribe((data) => {
            this.secondToken = data;
          });
        }

        if (this.firstToken.id != null && this.secondToken.id != null) {
          this.kanbanCallMethod();
        }
      });
  }

  refresh() {
    this.kanbanService
      .getTokenBalance(this.account, this.firstToken.id)
      .subscribe((balance: any) => {
        this.firstCoinBalance = balance;
      });

    this.kanbanService
      .getTokenBalance(this.account, this.secondToken.id)
      .subscribe((balance: any) => {
        this.secondCoinBalance = balance;
      });

    this.checkLiquidity();
  }

  addLiqudity() {
    const paramsSent: any = [];
    let amountADesired =
      "0x" +
      new BigNumber(this.firstCoinAmount)
        .shiftedBy(this.firstToken.decimals)
        .toString(16)
        .split(".")[0];
    let amountBDesired =
      "0x" +
      new BigNumber(this.secondCoinAmount)
        .shiftedBy(this.secondToken.decimals)
        .toString(16)
        .split(".")[0];

    var tokenA = this.firstToken.id;
    var tokenB = this.secondToken.id;

    let params: any = [environment.smartConractAdressRouter, amountADesired];
    let abiHex = this.web3Service.getApprove(params);

    paramsSent.push({
      to: tokenA,
      data: abiHex,
    });

    params = [environment.smartConractAdressRouter, amountBDesired];
    abiHex = this.web3Service.getApprove(params);

    paramsSent.push({
      to: tokenB,
      data: abiHex,
    });

    var amountAMin =
      "0x" +
      new BigNumber(this.firstCoinAmount)
        .multipliedBy(
          new BigNumber(1).minus(new BigNumber(this.slippage * 0.01))
        )
        .shiftedBy(this.firstToken.decimals)
        .toString(16)
        .split(".")[0];
    var amountBMin =
      "0x" +
      new BigNumber(this.secondCoinAmount)
        .multipliedBy(
          new BigNumber(1).minus(new BigNumber(this.slippage * 0.01))
        )
        .shiftedBy(this.secondToken.decimals)
        .toString(16)
        .split(".")[0];
    var to = this.account;
    var timestamp = new TimestampModel(
      this.deadline,
      0,
      0,
      0 // here need to set for future timestamp
    );
    var deadline = this.utilService.getTimestamp(timestamp);

    params = [
      tokenA,
      tokenB,
      amountADesired,
      amountBDesired,
      amountAMin,
      amountBMin,
      to,
      deadline,
    ];

    abiHex = this.web3Service.addLiquidity(params);
    paramsSent.push({
      to: environment.smartConractAdressRouter,
      data: abiHex,
    });

    this.storage.getDeviceID().subscribe((device_id: any) => {
      if (device_id) {
        const paramsSentSocket = {
          source: "Biswap-addLiquidity",
          data: paramsSent,
        };
        this.connectServ.send(paramsSentSocket)
        // send(paramsSentSocket);
      } else {
        const alertDialogRef = this.dialog.open(AlertComponent, {
          width: "250px",
          data: { text: "Please approve your request in your wallet" },
        });

        this.kanbanService
          .sendParams(paramsSent)
          .then((txids: any[]) => {
            alertDialogRef.close();
            const baseUrl = environment.production
              ? "https://www.exchangily.com"
              : "https://test.exchangily.com";

            this.txHashes = txids.map(
              (txid: string) => baseUrl + "/explorer/tx-detail/" + txid
            );

            setTimeout(() => {
              this.refresh();
            }, 6000);
          })
          .catch((error: any) => {
            alertDialogRef.close();
            this._snackBar.open(error, "Ok");
          }
          );
      }
    });

  }

  ngOnDestroy(): void {
    if (this.txSubscription) {
      this.txSubscription.unsubscribe();
    }
  }
}
