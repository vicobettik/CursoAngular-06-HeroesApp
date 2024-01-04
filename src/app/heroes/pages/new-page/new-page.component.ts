import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

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
              private router:Router,
              private snackbar:MatSnackBar,
              private dialog:MatDialog){}

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
        // console.log({hero})
        return;
      })
  }

  get currentHero():Hero{
    const hero = this.heroForm.value as Hero;
    // console.log(hero)
    return hero;
  }

  public onSubmit(){
    console.log('click')
    if (this.heroForm.invalid) {
      return;
    }
    console.log(this.currentHero)
    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero)
        .subscribe((hero) => {
          console.log('updated')
          this.showSnackBar(`${hero.superhero} updated`);
        });
    }
    else{
      this.heroesService.addHero(this.currentHero)
        .subscribe((hero) => {
          this.showSnackBar(`${hero.superhero} updated`);
          this.router.navigate(['/heroes/edit', hero.id])
        });
    }
    // this.heroesService.updateHero(this.heroForm.value)

    console.log({
      formisvalid: this.heroForm.valid,
      value: this.heroForm.value
    })
  }

  onDeleteHero(){
    if (!this.currentHero.id) {
      throw Error(`Hero id is required`)
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef.afterClosed()
      .pipe(
        filter((res:boolean) => res == true),
        switchMap(() => this.heroesService.deleteHeroById(this.currentHero.id)),
        tap((wasDeleted) => console.log(wasDeleted)),
        filter((wasDeleted) => wasDeleted)
      )
      .subscribe(result => {
        this.router.navigate(['/heroes'])
    })

    // dialogRef.afterClosed().subscribe(result => {
    //   if (!result) return;
    //   this.heroesService.deleteHeroById(this.currentHero.id)
    //     .subscribe((res) => {
    //       if(res) this.router.navigate(['/heroes'])
    //     })
      
    // });

  }

  showSnackBar(message:string):void{
    this.snackbar.open(message,'done',{duration: 2500})
  }

}
