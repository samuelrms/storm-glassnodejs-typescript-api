import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { Application } from 'express';

import { ForecastController } from './controllers/forecast';
import './utils/module-alias';
import * as database from '@src/databse';
import { BeachesController } from './controllers/beaches';

export class SetupServer extends Server {
  constructor(private port = 7777) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.setupControllers();
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    this.addControllers([forecastController, beachesController]);
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }
  public getApp(): Application {
    return this.app;
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.info('Server listening on port: ' + this.port);
    });
  }
}
