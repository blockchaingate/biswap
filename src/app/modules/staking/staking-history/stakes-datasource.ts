import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { BehaviorSubject, Observable, catchError, of, finalize } from 'rxjs';
import { StakeService } from 'src/app/services/stake.service';

export interface StakeElement {
    event: string;
    position: number;
    amount: number;
    status: string;
}
export class StakesDataSource implements DataSource<StakeElement> {

    private stakesSubject = new BehaviorSubject<StakeElement[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private stakeService: StakeService) {}

    connect(collectionViewer: CollectionViewer): Observable<StakeElement[]> {
        return this.stakesSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.stakesSubject.complete();
        this.loadingSubject.complete();
    }

    
    loadStakes(account: string, pageSize = 10, pageNum = 0) {

        this.loadingSubject.next(true);

        this.stakeService.getAllStakesByUser(account, pageSize, pageNum).pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        )
        .subscribe((stakes: any) => {
            this.stakesSubject.next(stakes)
        });
    }  

}