import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IGame } from '../../shared/models/utils.model';
import { offers } from './mock';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  dropdownOption: string;
  searchForm: FormGroup;
  offersList: IGame[] = offers;
  offersListImutable: IGame[] = offers;
  selectFilterOptions: any[] = [
    {
      Id: 1,
      Type: 'DiscountPercentage',
      Name: '% de Desconto'
    },
    {
      Id: 2,
      Type: 'PriceHigh',
      Name: 'Maior preço'
    },
    {
      Id: 3,
      Type: 'PriceLow',
      Name: 'Menor preço'
    },
    {
      Id: 4,
      Type: 'Title',
      Name: 'Título'
    }
  ];
  isMobile: boolean = false;
  searchOfferSubscription: Subscription;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.setSalePricePercentage();

    this.searchForm = this.fb.group({
      gameText: [''],
      selectFilter: [1]
    });
    this.searchOfferSubscription = this.searchForm.get('gameText').valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(res => {
      let filter = this.offersList.filter(el => {
        let name = el.title.toLowerCase();
        return name.match(res.toLowerCase())
      })
      if (filter.length < this.offersList.length) {
        this.offersList = filter;
      } else {
        this.offersList = this.offersListImutable;
      }
    })

    this.checkDevice();

    this.setSelectFilter('DiscountPercentage');
  }

  ngOnDestroy() {
    this.searchOfferSubscription.unsubscribe();
  }

  convertPriceToNumber(price: string) {
    return parseFloat(price.replace(',', '.'));
  }

  setSalePricePercentage() {
    let offersWithPercentage = offers.map(offer => {
      const salePriceNumeric = this.convertPriceToNumber(offer.salePrice);
      const normalPriceNumeric = this.convertPriceToNumber(offer.normalPrice);

      let percentageResult = (1 - salePriceNumeric / normalPriceNumeric) * 100;

      return {
        percentage: percentageResult,
        salePriceNumeric: salePriceNumeric,
        normalPriceNumeric: normalPriceNumeric,
        ...offer
      }
    })

    this.offersList = [...offersWithPercentage];
    this.offersListImutable = [...offersWithPercentage];
  }

  checkDevice() {
    if (window.innerWidth > 425) {
      this.isMobile = false
    } else {
      this.isMobile = true;
    }
  }

  setSelectFilter(type: string) {
    switch(type) {
      case 'DiscountPercentage': 
        this.offersList = this.offersList.sort((a, b) => {
          return a.percentage < b.percentage ? 1 : -1;
        })
        break;
      case 'PriceHigh':
        this.offersList = this.offersList.sort((a, b) => {
          return a.salePriceNumeric < b.salePriceNumeric ? 1 : -1;
        })
        break;

      case 'PriceLow':
        this.offersList = this.offersList.sort((a, b) => {
          return a.salePriceNumeric > b.salePriceNumeric ? 1 : -1;
        })
        break;

      case 'Title':
        this.offersList = this.offersList.sort((a, b) => {
          return a.title > b.title ? 1 : -1;
        })
        break;
    }
  }

}

