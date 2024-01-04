import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit{

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

  constructor(private heroesService:HeroesService,
              private activatedroute:ActivatedRoute,
              private router:Router){}

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;

    this.activatedroute.params
      .pipe(
        switchMap(({id}) => {
          return this.heroesService.getHeroById(id)
        })
      )
      .subscribe((hero) => {
        if (!hero) {
          return this.router.navigateByUrl('/');
        }
        this.heroForm.reset(hero);
        console.log({hero})
        return;
      })
  }

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
