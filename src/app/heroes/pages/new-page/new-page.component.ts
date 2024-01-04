import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent {

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', {nonNullable:true}),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl<string>(''),
    first_appearance: new FormControl<string>(''),
    characters: new FormControl(''),
    alt_image: new FormControl(''),
  });

  public publishers = [
    {id: 'DC Comics', desc: 'DC - Comics'},
    {id: 'Marvel Comics', desc: 'Marvel - Comics'}
  ];

  constructor(private heroesService:HeroesService){}

  get currentHero():Hero{
    const hero = this.heroForm.value as Hero;
    console.log(hero)
    return hero;
  }

  public onSubmit(){
    if (this.heroForm.invalid) {
      return;
    }

    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero)
        .subscribe((hero) => {
          // TODO mostrar snackbar
        });
    }
    else{
      this.heroesService.addHero(this.currentHero)
        .subscribe((hero) => {
          // TODO mostrar snackbar y navegar a /heros/edit/hero.id
        });
    }
    // this.heroesService.updateHero(this.heroForm.value)

    console.log({
      formisvalid: this.heroForm.valid,
      value: this.heroForm.value
    })
  }

}
