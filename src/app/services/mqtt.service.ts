import { Injectable } from '@angular/core';
const mqtt = require('mqtt');

@Injectable({
  providedIn: 'root'
})
export class MqttService {
  static sendMqttMessage(arg0: string) {
    throw new Error('Method not implemented.');
  }

  private clientId = 'mqttjs_' + Math.random().toString(8).substr(2, 4);
  private client = mqtt.connect('mqtt://test.mosquitto.org', {clientId: this.clientId});
  private topic : string


  constructor() {  
    this.topic = 'test/IrrigaJun' + Math.random().toString(8).substr(2, 4);
  }

  public sendMqttMessage(message: string) {
    this.client.on("connect",(connack: boolean) =>{   
      console.log("Connected client", connack); 
  
      const payload = JSON.parse(message);
      this.client.publish(this.topic, JSON.stringify(payload), {qos: 1, retain: true}, (err: any, packet: any) => {
        if (err) {
          console.log("Error publishing message", err);
        } else {
          console.log("Posted message", packet);
        }
      });
    }) 
  }

  public receiveMqttMessage() {
    return "Hello World";
  }

  public connect() {
    this.client.on("connect",(connack: boolean) =>{
      console.log("Connected client", connack);
      this.client.subscribe(this.topic, {qos: 1}, (err: any, granted: any) => {
        if (err) {
          console.log("Error subscribing to topic", err);
        } else {
          console.log("Subscribed to topic", granted);
        }
      });
    });
  }

  public disconnect(err : Error) {
    this.client.end(false, err, () => {
      console.log("Disconnected client", err);
    });
  }

  public getScheduleFromStore() {
    // TODO: implementar um método para pegar o agendamento do banco de dados
  }
}
