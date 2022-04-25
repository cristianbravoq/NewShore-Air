import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, tap } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor() { 
    this.inputOrigin.valueChanges.pipe(tap(res => this.origin.emit(res))).subscribe();
  }

  ngOnInit(): void {
    this.onChange();
  }

  inputOrigin = new FormControl('');
  @Output() origin = new EventEmitter<string>();

  inputDestination = new FormControl('');
  @Output() destination = new EventEmitter<string>();

  // search = new FormControl('')
  // @Output('search') searchEmitter = new EventEmitter<string>();

  onChange(): void {
    this.inputDestination.valueChanges
      .pipe(
        // map((search: string) => search.trim()),
        // debounceTime(500),
        distinctUntilChanged(),
        filter((search: string) => search !== ''),
        tap((search: string) => this.destination.emit(search))
      )
      .subscribe()

    this.inputOrigin.valueChanges
      .pipe(
        // map((search: string) => search.trim()),
        // debounceTime(500),
        distinctUntilChanged(),
        filter((search: string) => search !== ''),
        tap((search: string) => this.origin.emit(search))
      )
      .subscribe()
  }

}
