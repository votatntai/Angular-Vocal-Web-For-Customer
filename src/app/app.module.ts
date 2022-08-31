import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxSpinnerModule } from "ngx-spinner";
import { BarRatingModule } from "ngx-bar-rating";
import { ImageCropperModule } from 'ngx-image-cropper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StatusPipe, FileStatusPipe } from './pipes/status.pipe';
import { StarPipe } from './pipes/star.pipe';
import { CurrencyPipe } from '@angular/common';
import { SecondToHourPipe } from './pipes/time.pipe';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ErrorComponent } from './error/error.component';
import { RegisterComponent } from './register/register.component';
import { NavigationComponent } from './main/navigation/navigation.component';
import { HomeComponent } from './main/home/home.component';
import { FooterComponent } from './main/footer/footer.component';
import { JobsComponent } from './main/jobs/jobs.component';
import { ProcessingComponent } from './main/jobs/processing/processing.component';
import { DetailComponent } from './main/jobs/detail/detail.component';
import { BalanceComponent } from './main/balance/balance.component';
import { ProfileComponent } from './main/profile/profile.component';
import { AvatarComponent } from './main/profile/avatar/avatar.component';
import { SubscriptionComponent } from './main/subscription/subscription.component';
import { DoneComponent } from './main/jobs/done/done.component';
import { PendingComponent } from './main/jobs/pending/pending.component';
import { CreateComponent } from './main/jobs/create/create.component';
import { SwiperModule } from 'swiper/angular';
import { VocalDetailComponent } from './main/vocal-detail/vocal-detail.component';
import { WaitingComponent } from './main/jobs/waiting/waiting.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    ForgetPasswordComponent,
    ErrorComponent,
    RegisterComponent,
    NavigationComponent,
    HomeComponent,
    StatusPipe,
    FileStatusPipe,
    FooterComponent,
    JobsComponent,
    ProcessingComponent,
    DetailComponent,
    BalanceComponent,
    ProfileComponent,
    AvatarComponent,
    SubscriptionComponent,
    DoneComponent,
    PendingComponent,
    CreateComponent,
    VocalDetailComponent,
    SecondToHourPipe,
    StarPipe,
    WaitingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ImageCropperModule,
    SwiperModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    BarRatingModule
  ],
  providers: [CurrencyPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
