import { Injectable } from '@angular/core';
import { AngularFireRemoteConfig } from '@angular/fire/compat/remote-config';

@Injectable({
	providedIn: 'root'
})
export class FirebaseRemoteConfigService {

	constructor(private remoteConfig: AngularFireRemoteConfig) { }

	/**
	 * Inicializa Remote Config e intenta obtener y activar los valores remotos.
	 * Es importante llamarlo una vez al inicio para asegurar configuración actualizada.
	 * 
	 * @returns Promise<void> sin resultado. Imprime configuración en consola si es exitosa.
	 */
	async initRemoteConfig(): Promise<void> {
		try {
			await this.remoteConfig.fetchAndActivate();
			console.log('✅ Remote Config activado:', this.remoteConfig.getAll());
		} catch (error) {
			console.error('❌ Error activando Remote Config', error);
		}
	}

	/**
	 * Obtiene el valor de un parámetro remoto de tipo booleano.
	 *
	 * @param flagName Nombre del flag definido en Firebase
	 * @param defaultValue Valor por defecto si el parámetro no existe o falla
	 * @returns Promesa que resuelve con el valor booleano del flag
	 */
	async getBooleanFlag(flagName: string, defaultValue: boolean = false): Promise<boolean> {
		try {
			const value = await this.remoteConfig.getBoolean(flagName);
			return value ?? defaultValue;
		} catch (error) {
			return defaultValue;
		}
	}
}
