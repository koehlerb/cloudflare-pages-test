import React, { useState, useEffect, FormEvent } from 'react';
import { Paginated } from '@feathersjs/feathers';
import client from './feathers';

interface Car {
  make: string,
  model: string,
  year: number,
  plate: string,
  id: number
};

type CarFunction = (g: Car) => void;

interface AllCarFuntions {
  addCar: CarFunction,
  removeCar: CarFunction
};

let carFuncs: AllCarFuntions = {
  addCar: (c: Car) => {},
  removeCar: (c: Car) => {}
};

const carsService = client.service('cars');

carsService.on( 'created', (newCar: Car) => {
  carFuncs.addCar( newCar );
});

carsService.on( 'removed', (oldCar: Car) => {
  carFuncs.removeCar( oldCar );
});

function Cars() {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(2021);
  const [plate, setPlate] = useState("");
  const [allCars, setAllCars] = useState<Array<Car>>([]);
  const [plateMessage, setPlateMessage] = useState("A valid license plate is required");
  const [plateClass, setPlateClass] = useState("form-control");

  const handleDelete = (id: number) => {
      carsService.remove( id );
  }

  const carRows = allCars.map( (car: Car ) =>
    <tr key={car.id}>
      <td>{car.id}</td>
      <td>{car.make}</td>
      <td>{car.model}</td>
      <td>{car.year}</td>
      <td>{car.plate}</td>
      <td><button onClick={() => handleDelete(car.id)} type="button" className="btn btn-danger">Delete</button></td>
    </tr>
  );

  useEffect(() => {
    function addCarX( newCar: Car ) {
      setAllCars( [...allCars, newCar] );
    }

    function removeCarX( oldCar: Car ) {
      const newCars = allCars.filter((icar,index,arr) => {
        return icar.id !== oldCar.id;
      });
      setAllCars( newCars );
    }

    carFuncs.addCar = addCarX;
    carFuncs.removeCar = removeCarX;
  });

  useEffect(() => {
    carsService
    .find()
    .then( (carPage: Paginated<Car>) => setAllCars( carPage.data ));
  }, []);

  const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      const element = e.currentTarget as HTMLFormElement;
      if ( element.checkValidity() ) {
        element.classList.remove('was-validated');
        carsService
        .create({ make, model, year, plate })
        .then( (car: Car) => {
          setMake("");
          setModel("");
          setYear(2021);
          setPlate("");
          setPlateMessage("A valid license plate is required.");
          setPlateClass("form-control");
        })
        .catch( (err: any) => {
          setPlateMessage( err.message );
          setPlateClass("form-control is-invalid");
        });
      } else {
        element.classList.add('was-validated');
      }
  }

  return (
    <div>
      <div className="py-5 text-center">
        <h2>Cars</h2>
      </div>

      <div className="row">
        <div className="col-md-12 order-md-1">
          <form onSubmit={handleSubmit} noValidate>
            <div className="row">
              <div className="col-lg-4 col-md-6 mb-3">
                <label htmlFor="make">Make</label>
                <input type="text" className="form-control" id="make" maxLength={5}
                  value={make} required onChange={e => setMake( e.target.value )} />
                <div className="invalid-feedback">
                    A car make is required.
                </div>
              </div>

              <div className="col-lg-4 col-md-6 mb-3">
                <label htmlFor="model">Model</label>
                <input type="text" className="form-control" id="model"
                  value={model} required onChange={e => setModel( e.target.value )} />
                <div className="invalid-feedback">
                    A car model is required.
                </div>
              </div>

              <div className="col-lg-2 col-sm-6 mb-3">
                <label htmlFor="year">Year</label>
                <input type="number" className="form-control" id="year" min="1885" max="2021"
                  value={year} required onChange={e => setYear( parseInt( e.target.value ) )} />
                <div className="invalid-feedback">
                    A model year is required.
                </div>
              </div>

              <div className="col-lg-2 col-sm-6 mb-3">
                <label htmlFor="plate">Plate</label>
                <input type="text" className={plateClass} id="plate" pattern="[A-Z0-9]{1,6}"
                  value={plate} required onChange={e => setPlate( e.target.value )} />
                <div className="invalid-feedback">
                    {plateMessage}
                </div>
              </div>

            </div>
            <button className="btn btn-primary btn-lg btn-block" type="submit">Add car</button>
          </form>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Make</th>
            <th scope="col">Model</th>
            <th scope="col">Year</th>
            <th scope="col">Plate</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>

          {carRows}

        </tbody>
      </table>

    </div>
  );
}

export default Cars;
