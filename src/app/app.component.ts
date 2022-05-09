import { Component } from '@angular/core';
import Web3 from 'web3';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'biSwap';
  private web3: Web3;

  constructor() {
    // this.web3 = new Web3("http://localhost:4200/");
    // const accountTemp = this.web3.eth.getAccounts();
    // console.log("Accounts temp: " + accountTemp);
    // console.log(" account: " + (this.web3.eth.accounts.create()).address);
    // console.log("SignContracts:");

  }

}
