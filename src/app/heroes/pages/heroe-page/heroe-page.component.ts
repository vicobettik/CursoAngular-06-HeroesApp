import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, switchMap } from 'rxjs';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-heroe-page',
  templateUrl: './heroe-page.component.html',
  styleUrl: './heroe-page.component.css'
})
export class HeroePageComponent implements OnInit{

  public hero?:Hero;

  constructor(private heroesService:HeroesService
              ,private activatedRoute:ActivatedRoute
              ,private router:Router){}

  ngOnInit(): void {
    this.activatedRoute.params
    .pipe(
      delay(2000),
      switchMap(({id}) => this.heroesService.getHeroById(id)),
    )
    .subscribe((hero) => {
      if (!hero) {
        this.router.navigate(['/heroes/list'])
      }
      return this.hero = hero;
    })
  }

  goBack():void{
    this.router.navigateByUrl('heroes/list');
  }



}
