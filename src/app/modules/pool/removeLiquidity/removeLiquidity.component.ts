import { Component, Input, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { Router } from '@angular/router';
import BigNumber from 'bignumber.js';
import { TimestampModel } from 'src/app/models/temistampModel';
import { ApiService } from 'src/app/services/api.services';
import { KanbanService } from 'src/app/services/kanban.service';
import { UtilsService } from 'src/app/services/utils.service';
import { WalletService } from 'src/app/services/wallet.service';
import { Web3Service } from 'src/app/services/web3.service';
import { environment } from 'src/environments/environment';
import { SettingsComponent } from '../../settings/settings.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../../shared/alert/alert.component';
import { DataService } from 'src/app/services/data.service';
import {
  MatSnackBar
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-removeLiquidity',
  templateUrl: './removeLiquidity.component.html',
  styleUrls: ['./removeLiquidity.component.scss']
})
export class RemoveLiquidityComponent implements OnInit {
  slippage = 1;
  deadline = 20;

   firstToken: String;
   secondToken: String;
   txHash: string = '';
   firstTokenName: string = '';
   secondTokenName: string = '';

   yourPoolShare: number;
   pooledFirstToken:number;
   pooledSecondToken:number;
   totalPoolToken:number;

   selectedFirstTokenAmount = 0;
   selectedSecondTokenAmount = 0;

   pairId: String;

  percentage= 0;

  constructor(
    private router: Router,
    private web3Service: Web3Service,
    private kanbanService: KanbanService,
    private apiService: ApiService,
    private utilService: UtilsService,
    public dialog: MatDialog,
    private walletService: WalletService,
    private dataService: DataService,
    private _snackBar: MatSnackBar,
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation!.extras.state as {
      pairId: String, 
      firstToken: String, 
      secondToken: String, 
      yourPoolShare: number, 
      pooledFirstToken:number, 
      pooledSecondToken:number, 
      totalPoolToken:number};
    this.firstToken = state.firstToken;
    this.secondToken = state.secondToken;
    this.yourPoolShare = state.yourPoolShare;
    this.pooledFirstToken = (state.pooledFirstToken * state.yourPoolShare) / 100;
    this.pooledSecondToken = (state.pooledSecondToken * state.yourPoolShare) / 100;
    this.totalPoolToken = state.totalPoolToken;
    this.pairId = state.pairId;
   }

  ngOnInit() {

    this.dataService.GettokenList.subscribe((x) => {
      let a = x.find(o => o.type === Number(this.firstToken));
      if (a != undefined) {
        this.firstTokenName = a.tickerName;  
      }
      let b = x.find(o => o.type === Number(this.secondToken));
      if (b != undefined) {
        this.secondTokenName = b.tickerName;  
      }

    });
  }

  openSettings() {
    const dialogRef = this.dialog.open(SettingsComponent, {
      width: '250px',
      data: {slippage: this.slippage, deadline: this.deadline},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.slippage = result.slippage;
        this.deadline = result.deadline;
      }

    });
  }

  goBack(){
    this.router.navigate(['/pool']);
  }

  setAmount(percentage: number) {
    this.percentage = percentage;
    this.selectedFirstTokenAmount = Number((percentage * this.pooledFirstToken/100).toFixed(18));
    this.selectedSecondTokenAmount = Number((percentage * this.pooledSecondToken/100).toFixed(18));
  }


  onInputChange(event: MatSliderChange) {
    this.percentage = event.value!;
    this.setAmount(this.percentage);
    // this.selectedFirstTokenAmount = new BigNumber(this.percentage).multipliedBy(new BigNumber(this.pooledFirstToken)).dividedBy(new BigNumber(100)).toNumber();
    // this.selectedSecondTokenAmount = new BigNumber(this.percentage).multipliedBy(new BigNumber(this.pooledSecondToken)).dividedBy( new BigNumber(100)).toNumber();
  }

  removeLiquidity() {
    console.log('this.totalPoolToken===', this.totalPoolToken);
    var value = '0x' + new BigNumber (this.totalPoolToken)
    .multipliedBy(new BigNumber(this.percentage))
    .dividedBy(new BigNumber(100))
    .toString(16).split('.')[0];

    var params = [environment.smartConractAdressRouter, value];
    var abiHex = this.web3Service.getApprove(params);
    console.log('abiHex => ' + abiHex);
    
    const alertDialogRef = this.dialog.open(AlertComponent, {
      width: '250px',
      data: {text: 'Please approve your request in your wallet'},
    });

    this.kanbanService
      .send(this.pairId.toString(), abiHex)
      .then((data) => {
        console.log('https://test.exchangily.com/explorer/tx-detail/' + data)
        this.apiService.getTransactionStatus(data).subscribe((res: any) =>{
          //TODO here there will be if condition with status of tx
          alertDialogRef.close();
          this.removeLiquidityFun(value);
        })  
      }).catch(
        (error: any) => {
          console.log('error===', error);
          alertDialogRef.close();
          this._snackBar.open(error, 'Ok');
        }
      );;
  }

  removeLiquidityFun(value: any) {

    var amountAMin = '0x' + new BigNumber( this.yourPoolShare)
    .multipliedBy(new BigNumber(this.percentage))
    .multipliedBy(new BigNumber(this.pooledFirstToken))
    .dividedBy(new BigNumber(10000))
    .multipliedBy(new BigNumber(1).minus(new BigNumber(this.slippage * 0.01)))
    .shiftedBy(18)
    .toString(16).split('.')[0];
    var amountBMin = '0x' + new BigNumber( this.yourPoolShare)
    .multipliedBy(new BigNumber(this.percentage))
    .multipliedBy(new BigNumber(this.pooledSecondToken))
    .dividedBy(new BigNumber(10000))
    .multipliedBy(new BigNumber(1).minus(new BigNumber(this.slippage * 0.01)))
    .shiftedBy(18)
    .toString(16).split('.')[0];
    var to = this.walletService.account;
    var timestamp = new TimestampModel(
      this.deadline,
      0,
      0,
      0 // here need to set for future timestamp
    );
    var deadline = this.utilService.getTimestamp(timestamp);

    
    var params = [this.firstToken, this.secondToken, value ,amountAMin, amountBMin, to, deadline];


    var abiHex = this.web3Service.removeLiquidity(params);

    const alertDialogRef = this.dialog.open(AlertComponent, {
      width: '250px',
      data: {text: 'Please approve your request in your wallet'},
    });

    this.kanbanService
    .send( environment.smartConractAdressRouter, abiHex)
    .then((data) => {
      alertDialogRef.close();
      const baseUrl = environment.production ? 'https://www.exchangily.com' : 'https://test.exchangily.com';
      this.txHash = baseUrl + '/explorer/tx-detail/' + data;
    }).catch(
      (error: any) => {
        console.log('error===', error);
        alertDialogRef.close();
        this._snackBar.open(error, 'Ok');
      }
    );
  }
}
