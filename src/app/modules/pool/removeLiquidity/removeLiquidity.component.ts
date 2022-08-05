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

@Component({
  selector: 'app-removeLiquidity',
  templateUrl: './removeLiquidity.component.html',
  styleUrls: ['./removeLiquidity.component.scss']
})
export class RemoveLiquidityComponent implements OnInit {

   firstToken: String;
   secondToken: String;

   yourPoolShare: number;
   pooledFirstToken:number;
   pooledSecondToken:number;
   totalPoolToken:number;

   selectedFirstTokenAmount: number = 0;
   selectedSecondTokenAmount: number = 0;

   pairId: String;

  percentage= 0;
  deadline = 200;

  constructor(
    private router: Router,
    private web3Service: Web3Service,
    private kanbanService: KanbanService,
    private apiService: ApiService,
    private utilService: UtilsService,
    private walletService: WalletService,
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
    this.pooledFirstToken = state.pooledFirstToken;
    this.pooledSecondToken = state.pooledSecondToken;
    this.totalPoolToken = state.totalPoolToken;
    this.pairId = state.pairId;
   }

  ngOnInit() {

  }

  goBack(){
    this.router.navigate(['/pool']);
  }

  setAmount(percentage: number) {
    this.percentage = percentage;
    this.selectedFirstTokenAmount = (percentage * this.pooledFirstToken) / 100;
    this.selectedSecondTokenAmount = (percentage* this.pooledSecondToken) / 100;
  }


  onInputChange(event: MatSliderChange) {
    this.percentage = event.value!;
    this.selectedFirstTokenAmount = (this.percentage * this.pooledFirstToken) / 100;
    this.selectedSecondTokenAmount = (this.percentage* this.pooledSecondToken) / 100;
  }

  removeLiquidity() {

    var value =new BigNumber ((this.totalPoolToken *this.percentage ) / 100 ).multipliedBy(new BigNumber(1e18))
    .toFixed();

    var params = [environment.smartConractAdressRouter, value];
    var abiHex = this.web3Service.getApprove(params);
    console.log('abiHex => ' + abiHex);
    
    this.kanbanService
      .send(this.pairId.toString(), abiHex)
      .then((data) => {
        console.log('https://test.exchangily.com/explorer/tx-detail/' + data)
        this.apiService.getTransactionStatus(data).subscribe((res: any) =>{
          //TODO here there will be if condition with status of tx
          this.removeLiquidityFun(value);
        })  
      });
  }

  removeLiquidityFun(value: any) {

    var amountAMin = '0x' + new BigNumber( this.yourPoolShare)
    .multipliedBy(new BigNumber(this.percentage))
    .multipliedBy(new BigNumber(this.pooledFirstToken))
    .dividedBy(new BigNumber(10000))
    .shiftedBy(18)
    .toString(16).split('.')[0];
    var amountBMin = '0x' + new BigNumber( this.yourPoolShare)
    .multipliedBy(new BigNumber(this.percentage))
    .multipliedBy(new BigNumber(this.pooledSecondToken))
    .dividedBy(new BigNumber(10000))
    .shiftedBy(18)
    .toString(16).split('.')[0];
    var to = this.utilService.fabToExgAddress(this.walletService.account);
    var timestamp = new TimestampModel(
      this.deadline,
      0,
      0,
      0 // here need to set for future timestamp
    );
    var deadline = this.utilService.getTimestamp(timestamp);


    var params = [this.firstToken, this.secondToken, value ,amountAMin, amountBMin, to, deadline];


    var abiHex = this.web3Service.removeLiquidity(params);
    console.log('abiHex => ' + abiHex);
    this.kanbanService
    .send( environment.smartConractAdressRouter, abiHex)
    .then((data) => {
      console.log('https://test.exchangily.com/explorer/tx-detail/' + data)
    });
  }
}
