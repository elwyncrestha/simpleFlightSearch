import {Component, OnInit} from '@angular/core';
import {FlightService} from './service/flight.service';
import {Flight} from './model/flight';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from './util/ObjectUtil';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'simpleFlightSearch';
  flights: Array<Flight>;
  search: {
    departure: Date,
    arrival: Date,
    flightNumber: string,
    origin: string,
    destination: string,
  } = {
    departure: undefined,
    arrival: undefined,
    flightNumber: undefined,
    origin: undefined,
    destination: undefined
  };
  showLoadButton = false;
  filterForm: FormGroup;

  constructor(
    private flightService: FlightService,
    private formBuilder: FormBuilder,
  ) {
  }

  get departure() {
    return this.filterForm.get('departure');
  }

  get arrival() {
    return this.filterForm.get('arrival');
  }

  get flightNumber() {
    return this.filterForm.get('flightNumber');
  }

  get origin() {
    return this.filterForm.get('origin');
  }

  get destination() {
    return this.filterForm.get('destination');
  }

  ngOnInit(): void {
    this.loadFlights();
    this.buildFilterForm();
  }

  loadFlights(): void {
    this.flightService.getFlights(this.search).subscribe((response: any) => {
      this.flights = response.detail;
      this.showLoadButton = this.flights && this.flights.length === 0;
    }, error => {
      console.error(error);
    });
  }

  fillDummyData(): void {
    this.flightService.getDummyFlights().subscribe(value => {
      const flights: Array<Flight> = value;
      this.flightService.saveFlights(flights).subscribe(() => {
        this.loadFlights();
      }, error => {
        console.error(error);
      });
    });
  }

  buildFilterForm(): void {
    this.filterForm = this.formBuilder.group({
      departure: [undefined, [Validators.required]],
      arrival: [undefined, [Validators.required]],
      flightNumber: [undefined, Validators.required],
      origin: [undefined, Validators.required],
      destination: [undefined]
    });
    this.destination.disable();
    this.flightNumber.valueChanges.subscribe(value => {
      if (ObjectUtil.isEmpty(value)) {
        this.flightNumber.setValidators([]);
        this.flightNumber.updateValueAndValidity({emitEvent: false});
        this.origin.setValidators(Validators.required);
        this.origin.updateValueAndValidity({emitEvent: false});
        this.destination.setValidators(Validators.required);
        this.destination.updateValueAndValidity({emitEvent: false});
      } else {
        this.flightNumber.setValidators(Validators.required);
        this.flightNumber.updateValueAndValidity({emitEvent: false});
        this.origin.setValidators([]);
        this.origin.updateValueAndValidity({emitEvent: false});
        this.destination.setValidators([]);
        this.destination.updateValueAndValidity({emitEvent: false});
      }
    });
    this.origin.valueChanges.subscribe(value => {
      if (ObjectUtil.isEmpty(value)) {
        this.flightNumber.setValidators(Validators.required);
        this.flightNumber.updateValueAndValidity({emitEvent: false});
        this.origin.setValidators([]);
        this.origin.updateValueAndValidity({emitEvent: false});
        this.destination.setValidators([]);
        this.destination.updateValueAndValidity();
        this.destination.setValue(undefined);
        this.destination.disable();
      } else {
        this.flightNumber.setValidators([]);
        this.flightNumber.updateValueAndValidity();
        this.origin.setValidators(Validators.required);
        this.origin.updateValueAndValidity({emitEvent: false});
        this.destination.markAsTouched();
        this.destination.setValidators(Validators.required);
        this.destination.updateValueAndValidity();
        this.destination.enable();
      }
    });
  }

  onSearch(): void {
    this.search = {
      departure: ObjectUtil.setUndefinedIfNull(this.departure.value),
      arrival: ObjectUtil.setUndefinedIfNull(this.arrival.value),
      flightNumber: ObjectUtil.setUndefinedIfNull(this.flightNumber.value),
      origin: ObjectUtil.setUndefinedIfNull(this.origin.value),
      destination: ObjectUtil.setUndefinedIfNull(this.destination.value),
    };
    this.loadFlights();
  }
}
