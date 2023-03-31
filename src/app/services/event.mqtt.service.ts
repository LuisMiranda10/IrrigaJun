import { Injectable } from "@angular/core";
import { IMqttMessage, MqttService } from "ngx-mqtt";
import { Observable } from "rxjs";

@Injectable({        
    providedIn: 'root'    
})

export class EventMqttService {
  private endpoint: string;

  constructor(private _mqttService: MqttService) {
    this.endpoint = 'test';
  }

  topic(deviceId: String) : Observable<IMqttMessage> {
    let topicName = `/${this.endpoint}/${deviceId}`;
    return this._mqttService.observe(topicName);
  }

    unsafePublish(topic: string, message: string): void {
    this._mqttService.unsafePublish(topic, message, {qos: 1, retain: true});
  }
}