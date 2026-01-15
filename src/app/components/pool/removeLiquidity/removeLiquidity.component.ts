import { Component, OnInit } from "@angular/core";
import { MatSliderModule } from "@angular/material/slider";
import { Router } from "@angular/router";
import BigNumber from "bignumber.js";
import { TimestampModel } from "src/app/models/temistampModel";
import { ApiService } from "src/app/services/api.services";
import { KanbanService } from "src/app/services/kanban.service";
import { UtilsService } from "src/app/services/utils.service";
import { WalletService } from "src/app/services/wallet.service";
import { Web3Service } from "src/app/services/web3.service";
import { environment } from "src/environments/environment";
import { SettingsComponent } from "../../settings/settings.component";
import { MatDialog } from "@angular/material/dialog";
import { AlertComponent } from "../../shared/alert/alert.component";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { ConnectService } from "src/app/services/connect.service";
import { StorageService } from "src/app/services/storage.service";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { MatExpansionPanelActionRow } from '@angular/material/expansion';

@Component({
  selector: "app-removeLiquidity",
  standalone: true,
  imports: [FormsModule, MatExpansionPanelActionRow, MatCardModule, MatIconModule, MatSliderModule, MatSnackBarModule, TranslateModule],
  templateUrl: "./removeLiquidity.component.html",
  styleUrls: ["./removeLiquidity.component.scss"],
})
export class RemoveLiquidityComponent implements OnInit {
  slippage = 1;
  deadline = 20;

  firstToken: String;
  secondToken: String;
  txHashes: any = [];
  firstTokenName: string = "";
  secondTokenName: string = "";

  firstTokenDecimals: number = 18;
  secondTokenDecimals: number = 18;

  yourPoolShare: number;
  pooledFirstToken: number;
  pooledSecondToken: number;
  totalPoolToken: number;

  selectedFirstTokenAmount = 0;
  selectedSecondTokenAmount = 0;

  pairId: String;

  percentage = 0;

  constructor(
    private router: Router,
    private web3Service: Web3Service,
    private kanbanService: KanbanService,
    private apiService: ApiService,
    private utilService: UtilsService,
    public dialog: MatDialog,
    private walletService: WalletService,
    private storage: StorageService,
    private _snackBar: MatSnackBar,
    private connectService: ConnectService
  ) {
    const navigation = this.router.currentNavigation();
    const state = navigation!.extras.state as {
      pairId: string;
      firstTokenName: string;
      secondTokenName: string;
      firstTokenDecimals: number;
      secondTokenDecimals: number;
      firstToken: string;
      secondToken: string;
      yourPoolShare: number;
      pooledFirstToken: number;
      pooledSecondToken: number;
      totalPoolToken: number;
    };
    this.firstToken = state.firstToken;
    this.secondToken = state.secondToken;
    this.firstTokenName = state.firstTokenName;
    this.secondTokenName = state.secondTokenName;
    this.firstTokenDecimals = state.firstTokenDecimals;
    this.secondTokenDecimals = state.secondTokenDecimals;
    this.yourPoolShare = state.yourPoolShare;
    this.pooledFirstToken =
      (state.pooledFirstToken * state.yourPoolShare) / 100;
    this.pooledSecondToken =
      (state.pooledSecondToken * state.yourPoolShare) / 100;
    this.totalPoolToken = state.totalPoolToken;
    this.pairId = state.pairId;
  }

  ngOnInit() { }

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

  goBack() {
    this.router.navigate(["/pool"]);
  }

  setAmount(percentage: number) {
    this.percentage = percentage;
    this.selectedFirstTokenAmount = Number(
      ((percentage * this.pooledFirstToken) / 100).toFixed(
        this.firstTokenDecimals
      )
    );
    this.selectedSecondTokenAmount = Number(
      ((percentage * this.pooledSecondToken) / 100).toFixed(
        this.secondTokenDecimals
      )
    );
  }

  onInputChange(event: any) {
    this.percentage = event.value!;
    this.setAmount(this.percentage);
    // this.selectedFirstTokenAmount = new BigNumber(this.percentage).multipliedBy(new BigNumber(this.pooledFirstToken)).dividedBy(new BigNumber(100)).toNumber();
    // this.selectedSecondTokenAmount = new BigNumber(this.percentage).multipliedBy(new BigNumber(this.pooledSecondToken)).dividedBy( new BigNumber(100)).toNumber();
  }

  removeLiquidity() {
    var value =
      "0x" +
      new BigNumber(this.totalPoolToken)
        .multipliedBy(new BigNumber(this.percentage))
        .dividedBy(new BigNumber(100))
        .toString(16)
        .split(".")[0];

    const args1 = [environment.smartConractAdressRouter, value];
    var abiHex = this.web3Service.getApprove(args1);
    console.log("abiHex => " + abiHex);

    const params: any = [];
    params.push({
      to: this.pairId.toString(),
      data: abiHex,
    });

    var amountAMin =
      "0x" +
      new BigNumber(this.yourPoolShare)
        .multipliedBy(new BigNumber(this.percentage))
        .multipliedBy(new BigNumber(this.pooledFirstToken))
        .dividedBy(new BigNumber(10000))
        .multipliedBy(
          new BigNumber(1).minus(new BigNumber(this.slippage * 0.01))
        )
        .shiftedBy(this.firstTokenDecimals)
        .toString(16)
        .split(".")[0];
    var amountBMin =
      "0x" +
      new BigNumber(this.yourPoolShare)
        .multipliedBy(new BigNumber(this.percentage))
        .multipliedBy(new BigNumber(this.pooledSecondToken))
        .dividedBy(new BigNumber(10000))
        .multipliedBy(
          new BigNumber(1).minus(new BigNumber(this.slippage * 0.01))
        )
        .shiftedBy(this.secondTokenDecimals)
        .toString(16)
        .split(".")[0];
    var to = this.walletService.account;
    var timestamp = new TimestampModel(
      this.deadline,
      0,
      0,
      0 // here need to set for future timestamp
    );
    var deadline = this.utilService.getTimestamp(timestamp);

    const args2 = [
      this.firstToken,
      this.secondToken,
      value,
      amountAMin,
      amountBMin,
      to,
      deadline,
    ];

    abiHex = this.web3Service.removeLiquidity(args2);

    params.push({
      to: environment.smartConractAdressRouter,
      data: abiHex,
    });

    this.storage.getDeviceID().subscribe((device_id: any) => {
      if (device_id) {
        const paramsSentSocket = { source: "Biswap-addLiquidity", data: params };
        this.connectService.send(paramsSentSocket);
        //send(paramsSentSocket);
      } else {
        const alertDialogRef = this.dialog.open(AlertComponent, {
          width: "250px",
          data: { text: "Please approve your request in your wallet" },
        });

        this.kanbanService.sendParams(params)
          .then((txids: any) => {
            alertDialogRef.close();
            const baseUrl = environment.production
              ? "https://www.exchangily.com"
              : "https://test.exchangily.com";

            this.txHashes = txids.map(
              (txid: string) => baseUrl + "/explorer/tx-detail/" + txid
            );
            alertDialogRef.close();
          })
          .catch((error: any) => {
            alertDialogRef.close();
            console.log("error===", error);
            this._snackBar.open(error, "Ok");
          });
      }
    });

  }
}
