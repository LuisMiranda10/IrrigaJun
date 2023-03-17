import { Component, ViewChild } from '@angular/core';
import { IonDatetime } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

import { format, parseISO } from 'date-fns';
import { MqttService } from '../services/mqtt.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  @ViewChild(IonDatetime)
  private datetime!: IonDatetime;
  private valorData = format(new Date(), 'dd/MM/yyyy');
  private value = "";
  public inputData : string = '';
  public inputNota :string = '';
  private nota : string = '';
  private showPicker = false;
  public inputHorarioI = '';
  public inputHorarioF = '';
  private horarioI = '';
  private horarioF = '';
  private dataFormatada = '';

  constructor(private toastController: ToastController) {
    this.dataAtual();
  }

  dataAtual() {
    this.dataFormatada = format(new Date(), 'dd/MM/yyyy');
  }

  dataMudou(value: any) {
    this.valorData = value;
    this.dataFormatada = format(parseISO(value), 'dd/MM/yyyy');
    this.showPicker = false;
  }

  fechar() {
    this.datetime.cancel(true);
  }

  confirmar() {
    this.datetime.confirm(true);
    console.log(this.dataFormatada);
    console.log(this.valorData);
  }

  salvarNota() {
    if (this.inputNota == '') {
      this.nota = 'Sem nota';
      return true
    }

    this.nota = this.inputNota;
    console.log(this.nota);
    this.inputNota = '';
    return true
  }

  salvarHorarioI() {
    if (this.inputHorarioI == '') {
      return false
    }

    this.horarioI = this.inputHorarioI;
    console.log(this.horarioI);
    this.inputHorarioI = '';
    return true;
  }

  salvarHorarioF() {
    if (this.inputHorarioF == '') {
      return false
    }

    this.horarioF = this.inputHorarioF;
    console.log(this.horarioF);
    this.inputHorarioF = '';
    return true;
  }

  inputsVerification() {
    if (this.inputData == '' || this.inputHorarioI == '' || this.inputHorarioF == '') {
      return false;
    }


    if (Number(this.inputHorarioI) < Number(format(new Date(), 'HH'))) {
      return false;
    }

    let actualYear = Number(format(new Date(), 'yyyy'))
    let actualMonth = Number(format(new Date(), 'MM'))
    let actualDay = Number(format(new Date(), 'dd'))

    let inputYear = Number(format(parseISO(this.inputData), 'yyyy'))
    let inputMonth = Number(format(parseISO(this.inputData), 'MM'))
    let inputDay = Number(format(parseISO(this.inputData), 'dd'))
    if (inputYear < actualYear || inputMonth < actualMonth || inputDay < actualDay) {
      return false;
    }

    return true;
  }

  async avisoToast() {
    const toast = await this.toastController.create({
      message: 'Preencha todos os campos',
      duration: 1500,
      color: 'danger',
      position: 'bottom'
    });

    await toast.present();
  }

  async confirmaçãoToast() {
    const toast = await this.toastController.create({
      message: 'Agendamento salvo com sucesso!',
      duration: 1500,
      color: 'success',
      position: 'bottom'
    });

    await toast.present();
  }

  async errorInputsToast() {
    const toast = await this.toastController.create({
      message: 'Verifique os campos corretamente',
      duration: 1500,
      color: 'danger',
      position: 'bottom'
    });

    await toast.present();
  }

  salvarAgendamento() {
    if(this.inputsVerification()) {
      this.confirmaçãoToast();
      console.log(this.inputData);
      console.log(this.inputHorarioI + ' - ' + this.inputHorarioF);
      MqttService.sendMqttMessage('{Data: ' + this.inputData + ', Horario: ' + this.inputHorarioI + ' - ' + this.inputHorarioF + ', Nota: ' + this.nota + '}');
    } else if(this.inputData == '' || this.inputHorarioI == '' || this.inputHorarioF == '') {
      this.avisoToast();
      console.log('aviso');
    } else {
      this.errorInputsToast();
      console.log('erro');
    }

    this.inputData = '';
    this.inputHorarioI = '';
    this.inputHorarioF = '';
    this.inputNota = '';
  } 
}