import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { parseJsonConfigFileContent } from 'typescript';
import { IGame } from '../../shared/models/utils.model';
import { offers } from './mock';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  dropdownOption: string;
  searchForm: FormGroup;
  offersList: IGame[] = offers;
  selectFilterOptions: any[] = [
    {
      Id: 1,
      Name: '% de Desconto'
    },
    {
      Id: 2,
      Name: 'Maior preço'
    },
    {
      Id: 3,
      Name: 'Menor preço'
    },
    {
      Id: 4,
      Name: 'Título'
    }
  ];
  isMobile: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.setSalePricePercentage();

    this.searchForm = this.fb.group({
      gameText: [''],
      selectFilter: [1]
    });

    this.checkDevice();
  }

  setSalePricePercentage() {
    this.offersList = this.offersList.map(offer => {
      let percentageResult = (parseInt(offer.salePrice) * 100) / parseInt(offer.normalPrice);
      return {
        percentage: percentageResult.toFixed(0),
        ...offer
      }
    })
  }

  checkDevice() {
    if (window.innerWidth > 425) {
      this.isMobile = false
    } else {
      this.isMobile = true;
    }
  }

}
