import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IGame } from '../../shared/models/utils.model';
import { OffersService } from '../services/offers.service';

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
    this.checkDevice();
    this.getOffers();

    this.searchForm = this.fb.group({
      gameText: [''],
      selectFilter: ['DiscountPercentage']
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
      this.setSelectFilter(this.searchForm.get('selectFilter').value)
    })
  }

  ngOnDestroy() {
    this.searchOfferSubscription.unsubscribe();
  }

  convertPriceToNumber(price: string) {
    return parseFloat(price.replace(',', '.'));
  }

  replacePriceDotsToComma(price: string) {
    return price.replace('.', ',')
  }

  setPriceNumeric(offers: IGame[]) {
    let offersWithPercentage = offers.map(offer => {
      const salePriceNumeric = this.convertPriceToNumber(offer.salePrice);
      const normalPriceNumeric = this.convertPriceToNumber(offer.normalPrice);
      const savingsNumeric = this.convertPriceToNumber(offer.savings);

      return {
        percentage: savingsNumeric,
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
        offer.salePrice = this.replacePriceDotsToComma(offer.salePrice);
        offer.normalPrice = this.replacePriceDotsToComma(offer.normalPrice);
      });

      resultWithCorrectThumb = res;
      this.setPriceNumeric(resultWithCorrectThumb);
      this.setSelectFilter('DiscountPercentage');
    })
  }

  getOfferThumb(steamAppID: string) {
    const thumb = `https://cdn.akamai.steamstatic.com/steam/apps/${steamAppID}/header.jpg`;
    return steamAppID == null ? '../assets/images/sem-imagem.jpg' : thumb;
  }

}

