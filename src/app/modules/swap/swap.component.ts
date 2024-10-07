import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import BigNumber from "bignumber.js";
import { ErrorMessagesComponent } from "src/app/components/errorMessages/errorMessages.component";
import { Coin } from "src/app/models/coin";
import { TimestampModel } from "src/app/models/temistampModel";
import { ApiService } from "src/app/services/api.services";
import { BiswapService } from "src/app/services/biswap.service";
import { DataService } from "src/app/services/data.service";
import { KanbanService } from "src/app/services/kanban.service";
import { UtilsService } from "src/app/services/utils.service";
import { WalletService } from "src/app/services/wallet.service";
import { Web3Service } from "src/app/services/web3.service";
import { environment } from "src/environments/environment";
import { TokenListComponent } from "../shared/tokenList/tokenList.component";
import { SettingsComponent } from "../settings/settings.component";
import { MatDialog } from "@angular/material/dialog";
import { AlertComponent } from "../shared/alert/alert.component";
import { timer } from "rxjs";
import { send } from "cool-connect";
import { AppComponent } from "src/app/app.component";

@Component({
  selector: "app-swap",
  templateUrl: "./swap.component.html",
  styleUrls: ["./swap.component.scss"],
})
export class SwapComponent implements OnInit, AfterViewInit {
  minimumReceived!: number;
  maximumSold!: number;
  insufficientFund: boolean = false;
  autorefresh: any;
  priceImpact: number = 0;
  liquidityPrividerFee!: number;
  liquidityPrividerFeeCoin: string = "";
  route: any;
  error: string = "";
  @ViewChild("token1")
  token1Element!: ElementRef;
  @ViewChild("token2")
  token2Element!: ElementRef;

  @ViewChild("animatedElement", { static: true })
  animatedElement!: ElementRef;

  isFistToken!: boolean;

  firstToken!: Coin;
  secondToken!: Coin;
  account!: string;
  editSlippage: boolean = false;
  slippageErr = false;

  public setFirstToken(coin: Coin) {
    this.firstToken = coin;
    const id = coin.id;
    if (this.account && id) {
      this.kanbanService
        .getTokenBalance(this.account, id)
        .subscribe((balance: any) => {
          this.firstCoinBalance = balance;
        });
    }
  }

  public setSecondToken(coin: Coin) {
    this.secondToken = coin;
    const id = coin.id;
    if (this.account && id) {
      this.kanbanService
        .getTokenBalance(this.account, id)
        .subscribe((balance: any) => {
          this.secondCoinBalance = balance;
        });
    }
  }

  tokenList!: Coin[];
  walletSession: any;

  setAccount(newAccount: string) {
    this.account = newAccount;
    if (newAccount) {
      if (this.firstToken && this.firstToken.id) {
        this.kanbanService
          .getTokenBalance(newAccount, this.firstToken.id)
          .subscribe((balance: any) => {
            console.log('balance111=', balance);
            this.firstCoinBalance = balance;
          });
      }

      if (this.secondToken && this.secondToken.id) {
        this.kanbanService
          .getTokenBalance(newAccount, this.secondToken.id)
          .subscribe((balance: any) => {
            this.secondCoinBalance = balance;
          });
      }
    }
  }

  tokenId!: string;
  firstCoinAmount!: number;
  secondCoinAmount!: number;
  perAmount!: string;
  perAmountLabel: string = "";
  secondCoinBalance!: number;
  firstCoinBalance!: number;
  txHashes: any = [];
  t1 = "";
  t2 = "";
  t1ft = "";
  t2ft = "";
  firstTokenReserve: BigNumber = new BigNumber(0);
  secondTokenReserve: BigNumber = new BigNumber(0);
  slippage = 1;
  deadline = 20;

  constructor(
    private utilService: UtilsService,
    private web3Service: Web3Service,
    private walletService: WalletService,
    private _snackBar: MatSnackBar,
    private dataService: DataService,
    private dialog: MatDialog,
    private kanbanService: KanbanService,
    private biswapServ: BiswapService,
    private currentRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private appComponent: AppComponent,
  ) { }

  openSettings() {
    const dialogRef = this.dialog.open(SettingsComponent, {
      width: "250px",
      data: { slippage: this.slippage, deadline: this.deadline },
      panelClass: "custom-dialog-container",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.slippage = result.slippage;
        this.deadline = result.deadline;
      }
    });
  }

  ngOnInit() {
    this.secondCoinBalance = -1;
    this.firstCoinBalance = -1;

    if (this.walletService.account) {
      this.setAccount(this.walletService.account);
    }

    this.walletService.accountSubject.subscribe(
      (accountSubject: any) => {
        if (accountSubject) {
          this.setAccount(accountSubject);
        }
      }
    );
    this.dataService.GettokenList.subscribe((x) => {
      this.tokenList = x;

      timer(1000).subscribe(() => {
        this.setDefaultPair();
      });
    });
    this.checkUrlToken();
  }

  setDefaultPair() {
    if (this.tokenList && this.tokenList.length > 0) {
      this.tokenList.map((t) => {
        if (t.symbol == "USDT") {
          this.setFirstToken(t);
        }
        if (t.symbol == "FAB") {
          this.setSecondToken(t);
        }
      });
      if (this.firstToken && this.secondToken) {
        this.getPair();
      }

    }
  }

  animateElement() {
    this.animatedElement.nativeElement.classList.add("show");
  }

  checkUrlToken() {
    this.currentRoute.params.subscribe((x) => {
      var type = this.router.url.split("/");
      if (type[2] == "token") {
        let params: any = x;
        if (params.tokenid) {
          this.apiService
            .getTokenInfoFromId(params.tokenid)
            .subscribe((res: any) => {
              let first = res["name"];
              this.firstToken =
                this.tokenList.find((x) => x.symbol == first) || new Coin();
            });
        }
      } else if (x.tokenid) {
        let params: any = x;
        if (params.tokenid) {
          this.apiService
            .getTokensInfoFromPair(params.tokenid)
            .subscribe((res: any) => {
              if (res) {
                let first = res["token0Name"];
                let sescond = res["token1Name"];
                this.firstToken =
                  this.tokenList.find((x) => x.symbol == first) || new Coin();
                this.secondToken =
                  this.tokenList.find((x) => x.symbol == sescond) || new Coin();
              }
            });
        }
      }
    });
  }

  async onKey(value: number, isFistToken: boolean) {
    this.isFistToken = isFistToken;
    if (
      this.firstToken.symbol != null &&
      this.secondToken.symbol != null &&
      value != null &&
      value != undefined
    ) {
      await this.setInputValues(isFistToken);
    }
  }

  ngAfterViewInit() {
    this.setDefaultPair();

    setTimeout(() => {
      // this will make the execution after the above boolean has changed
      this.token1Element.nativeElement.focus();
      this.token2Element.nativeElement.focus();
    }, 0);

    //typing effect for t1ft and t2ft, data from t1 and t2
    const speed = 70;
    const t1ft = this.t1;
    const t2ft = this.t2;
    let i = 0;
    let j = 0;
    this.t1ft = "";
    this.t2ft = "";

    const typeWriter = () => {
      if (i < t1ft.length + t2ft.length + 1) {
        if (i < t1ft.length) {
          this.t1ft += t1ft.charAt(i);
        } else if (i >= t1ft.length) {
          this.t2ft += t2ft.charAt(j);
          j++;
        }

        if (j == t2ft.length + 1) {
          this.t2ft += "!";
          this.animateElement();
        }
        i++;
        setTimeout(typeWriter, speed);
      }
    };

    typeWriter();
  }

  openDialog(errorMessage: String) {
    this.dialog.open(ErrorMessagesComponent, { data: errorMessage });
  }

  getPair() {
    if (!this.firstToken.id || !this.secondToken.id) {
      return;
    }
    var params = [this.firstToken.id, this.secondToken.id];
    var abiHex = this.web3Service.getPair(params);
    this.kanbanService
      .kanbanCall(environment.smartConractAdressFactory, abiHex)
      .subscribe((data: any) => {
        var address = this.web3Service.decodeabiHex(data.data, "address");
        this.tokenId = address.toString();
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
        if (x != undefined && x.isFirst) {
          this.dataService.GetFirstToken.subscribe((data) => {
            this.firstToken = data;
          });
        }

        if (this.firstToken.id != null && this.secondToken.id != null) {
          this.getPair();
        }
        this.refresh();
      });
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
        if (x != undefined && x.isSecond) {
          this.dataService.GetSecondToken.subscribe((data) => {
            this.secondToken = data;
          });
        }

        if (this.firstToken.id != null && this.secondToken.id != null) {
          this.getPair();
        }
        this.refresh();
      });
  }

  ngOnDestroy() {
    if (this.autorefresh) {
      clearInterval(this.autorefresh);
    }
  }

  async setInputValues(isFirst: boolean) {
    if (
      !this.tokenId ||
      this.tokenId == "0x0000000000000000000000000000000000000000"
    ) {
      return;
    }
    var abiHexa = this.web3Service.getReserves();
    this.kanbanService.kanbanCall(this.tokenId, abiHexa).subscribe((data1) => {
      var param = ["uint112", "uint112", "uint32"];
      let res: any = data1;

      var value = this.web3Service.decodeabiHexs(res.data, param);

      if (this.firstToken.id < this.secondToken.id) {
        this.firstTokenReserve = new BigNumber(value[0]);
        this.secondTokenReserve = new BigNumber(value[1]);
      } else {
        this.firstTokenReserve = new BigNumber(value[1]);
        this.secondTokenReserve = new BigNumber(value[0]);
      }

      if (isFirst && this.firstCoinAmount) {
        var amount: number = this.firstCoinAmount;
        this.insufficientFund = Number(amount) > Number(this.firstCoinBalance);
        var reserve1: BigNumber = this.firstTokenReserve;
        var reserve2: BigNumber = this.secondTokenReserve;
        let value =
          "0x" +
          new BigNumber(amount)
            .shiftedBy(this.firstToken.decimals)
            .toString(16);
        value = value.split(".")[0];

        this.secondCoinAmount = this.biswapServ.getAmountOut(
          amount,
          this.firstToken.decimals,
          this.secondToken.decimals,
          reserve1,
          reserve2
        );

        this.liquidityPrividerFee = new BigNumber(amount)
          .multipliedBy(new BigNumber(0.003))
          .toNumber();
        this.liquidityPrividerFeeCoin = this.firstToken.symbol;
        this.maximumSold = 0;
        this.minimumReceived = new BigNumber(this.secondCoinAmount)
          .multipliedBy(new BigNumber(1 - this.slippage * 0.01))
          .toNumber();
      } else if (!isFirst && this.secondCoinAmount) {
        var amount: number = this.secondCoinAmount;
        this.insufficientFund =
          Number(this.firstCoinAmount) > Number(this.firstCoinBalance);
        var reserve1: BigNumber = this.firstTokenReserve;
        var reserve2: BigNumber = this.secondTokenReserve;
        let value = new BigNumber(amount)
          .shiftedBy(this.secondToken.decimals)
          .toString(16);
        value = value.split(".")[0];
        const params = [value, reserve2, reserve1];
        var path = [this.firstToken.id, this.secondToken.id];
        this.firstCoinAmount = this.biswapServ.getAmountIn(
          amount,
          this.firstToken.decimals,
          this.secondToken.decimals,
          reserve1,
          reserve2
        );
        this.liquidityPrividerFee = new BigNumber(amount)
          .multipliedBy(new BigNumber(0.003))
          .toNumber();
        this.liquidityPrividerFeeCoin = this.secondToken.symbol;
        this.minimumReceived = 0;
        this.maximumSold = new BigNumber(this.firstCoinAmount)
          .multipliedBy(new BigNumber(1 + this.slippage * 0.01))
          .toNumber();
      }

      if (
        (isFirst && this.firstCoinAmount) ||
        (!isFirst && this.secondCoinAmount)
      ) {
        var perAmount = this.firstCoinAmount / this.secondCoinAmount;

        this.perAmountLabel =
          this.firstToken.symbol + " per " + this.secondToken.symbol;

        this.perAmount = perAmount.toString();

        const currentPerAmount = this.firstTokenReserve
          .shiftedBy(-this.firstToken.decimals)
          .dividedBy(
            this.secondTokenReserve.shiftedBy(-this.secondToken.decimals)
          )
          .toNumber();
        const diff =
          perAmount > currentPerAmount
            ? perAmount - currentPerAmount
            : currentPerAmount - perAmount;
        this.priceImpact = Number(((diff / perAmount) * 100).toFixed(2));

        this.route = [this.firstToken.symbol, this.secondToken.symbol];
      }
    });
  }

  changeTokens() {
    var temp = this.firstToken;
    this.firstToken = this.secondToken
    this.secondToken = temp;
    this.dataService.sendFirstToken(this.firstToken);
    this.dataService.sendSecondToken(this.secondToken);
    var tempBal = this.secondCoinBalance;
    this.secondCoinBalance = this.firstCoinBalance;
    this.firstCoinBalance = tempBal;

    this.firstCoinAmount = 0;
    this.secondCoinAmount = 0;

    //this.kanbanCallMethod();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  connectWallet() {
    this.walletService.connectWalletNew();
  }

  refresh() {
    if (this.account) {
      if (this.firstToken && this.firstToken.id) {
        this.kanbanService
          .getTokenBalance(this.account, this.firstToken.id)
          .subscribe((balance: any) => {
            this.firstCoinBalance = balance;
          });
      }

      if (this.secondToken && this.secondToken.id) {
        this.kanbanService
          .getTokenBalance(this.account, this.secondToken.id)
          .subscribe((balance: any) => {
            this.secondCoinBalance = balance;
          });
      }
    }

    this.setInputValues(this.isFistToken);
  }

  async swapFunction() {

    console.log('swapFunction --------------------------------->  started');

    if (
      (this.isFistToken && !this.firstCoinAmount && !this.firstCoinBalance && this.firstCoinAmount > this.firstCoinBalance) ||
      (!this.isFistToken && !this.secondCoinAmount && !this.secondCoinBalance && this.secondCoinAmount > this.secondCoinBalance)) {
      this.error = "Not enough balance";
      return;
    }

    var to = this.account;
    var timestamp = new TimestampModel(this.deadline, 0, 0, 0);
    var deadline = this.utilService.getTimestamp(timestamp);

    console.log('to --------------------------------->  started', to);
    console.log('deadline --------------------------------->  started', deadline);

    let abiHex = "";
    let approveAmount;
    if (this.isFistToken) {
      var path = [this.firstToken.id, this.secondToken.id];
      const amountIn =
        "0x" +
        new BigNumber(this.firstCoinAmount)
          .shiftedBy(this.firstToken.decimals)
          .toString(16)
          .split(".")[0];
      const amountOutMin =
        "0x" +
        new BigNumber(this.secondCoinAmount)
          .multipliedBy(new BigNumber(1 - this.slippage * 0.01))
          .shiftedBy(this.secondToken.decimals)
          .toString(16)
          .split(".")[0];
      const params = [amountIn, amountOutMin, path, to, deadline];
      console.log("params is1:", params);
      abiHex = this.web3Service.swapExactTokensForTokens(params);
      approveAmount = amountIn;
    } else {
      var path = [this.firstToken.id, this.secondToken.id];
      const amountOut =
        "0x" +
        new BigNumber(this.secondCoinAmount)
          .shiftedBy(this.secondToken.decimals)
          .toString(16)
          .split(".")[0];
      const amountInMax =
        "0x" +
        new BigNumber(this.firstCoinAmount)
          .multipliedBy(new BigNumber(1 + this.slippage * 0.01))
          .shiftedBy(this.firstToken.decimals)
          .toString(16)
          .split(".")[0];
      const params = [amountOut, amountInMax, path, to, deadline];
      console.log("params is2:", params);
      abiHex = this.web3Service.swapTokensForExactTokens(params);
      approveAmount = amountInMax;
    }

    if (this.appComponent.device_id) {
      const paramsSentSocket = {
        source: "Biswap-Swap",
        data: [
          {
            to: this.firstToken?.id, // Use optional chaining
            data: this.web3Service?.getApprove([
              environment.smartConractAdressRouter,
              approveAmount,
            ]),
          },
          {
            to: environment.smartConractAdressRouter,
            data: abiHex,
          },
        ],
      };

      if (paramsSentSocket.data[0].to && paramsSentSocket.data[0].data) {
        send(paramsSentSocket);
      } else {
        console.error("Failed to set up paramsSentSocket:", paramsSentSocket);
      }
    } else {

      const paramsSent = [
        {
          to: this.firstToken?.id,
          data: this.web3Service?.getApprove([
            environment.smartConractAdressRouter,
            approveAmount,
          ]),
        },
        {
          to: environment.smartConractAdressRouter,
          data: abiHex,
        },
      ];

      if (paramsSent[0].to && paramsSent[0].data) {
        const alertDialogRef = this.dialog.open(AlertComponent, {
          width: "250px",
          data: { text: "Please approve your request in your wallet" },
        });
        this.kanbanService
          .sendParams(paramsSent)
          .then((txids) => {
            alertDialogRef.close();
            const baseUrl = environment.production
              ? "https://www.exchangily.com"
              : "https://test.exchangily.com";
            //this.txHash = baseUrl + '/explorer/tx-detail/' + data;

            this.txHashes = txids.map(
              (txid: string) => baseUrl + "/explorer/tx-detail/" + txid
            );
          })
          .catch((error: any) => {
            alertDialogRef.close();
            console.log("error===", error);
            this._snackBar.open(error, "Ok");
          });
      } else {
        console.error("Failed to set up paramsSent:", paramsSent);
      }
    }

  }

  keyUp() {
    if(this.slippage<0 || this.slippage>100){
      this.slippageErr = true;
    } else {
      this.slippageErr = false;
    }
  }

  onBlur(){
    if(this.slippage<0 || this.slippage>100){
      this.slippage = 1;
      this.slippageErr = false;
    } 
  }
}

//TODO
//- amountOutMin will be calculated with fee price
//- wallet client will come from local session
