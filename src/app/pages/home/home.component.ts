import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  constructor(private fb: FormBuilder) { 
    this.dropdownOption = '% de Desconto'
   }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      gameText: ['']
    })
  }

}
