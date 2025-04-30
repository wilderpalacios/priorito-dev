import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class ToastService {
    constructor(private toastCtrl: ToastController) { }

    async show(message: string, color: string = 'success') {
        const toast = await this.toastCtrl.create({
            message,
            duration: 2000,
            position: 'bottom',
            color,
        });
        await toast.present();
    }
}
