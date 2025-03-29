import express from 'express';
import { Request, Response } from 'express';
import  EnvioRepository  from './../../domain/envios.repository';
import  EnviosUsecases  from './../../application/envios.usecases';
import enviosrepositoryMongo from '../db/envios.repository.mongo';


const router = express.Router();

const enviosrepository: EnvioRepository = new enviosrepositoryMongo();
const enviosusecases = new EnviosUsecases(enviosrepository);

