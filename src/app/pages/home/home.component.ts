import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IGame } from '../../shared/models/utils.model';
import { OffersService } from '../services/offers.service';
import { offers } from './mock';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  dropdownOption: string;
  searchForm: FormGroup;
  offersList: IGame[] = [];
  offersListImutable: IGame[] = [];
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

  constructor(private fb: FormBuilder, private offersService: OffersService) {}

  ngOnInit(): void {
    //this.setSalePricePercentage();
    this.checkDevice();
    this.getOffers();
    this.setSelectFilter('DiscountPercentage');

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
  }

  ngOnDestroy() {
    this.searchOfferSubscription.unsubscribe();
  }

  convertPriceToNumber(price: string) {
    return parseFloat(price.replace(',', '.'));
  }

  setSalePricePercentage(offers) {
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

  getOffers() {
    const params = {
      pageNumber: 0,
      pageSize: 12,
      onSale: 1,
      AAA: 1
    };

    this.offersService.getOffers(params).subscribe((res: IGame[]) => {
      let resultWithCorrectThumb = [];
      res.forEach(offer => {
        offer.thumb = this.getOfferThumb(offer.steamAppID);
      });

      resultWithCorrectThumb = res;
      this.setSalePricePercentage(resultWithCorrectThumb);
    })
  }

  getOfferThumb(steamAppID: string) {
    const thumb = `https://cdn.akamai.steamstatic.com/steam/apps/${steamAppID}/header.jpg`;
    return steamAppID == null ? '../assets/images/sem-imagem.jpg' : thumb;
  }

}

