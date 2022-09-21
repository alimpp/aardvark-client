import { ReleaseDSModule } from '@/store';
import { VuexModule, Mutation, Action, Module } from 'vuex-module-decorators'
import {Nullable} from '@/utils/generics';

@Module({name:'createreleasecs', namespaced: true})
export class CreateReleaseCS extends VuexModule {
    title = '';
    releaseDate = '';
    releaseCutoff = '';
    description = '';
    primaryMaestro: Nullable<number> = null;
    secondaryMaestro: Nullable<number> = null;

    @Mutation
    setTitle(value: string) {
        this.title = value;
    }

    @Mutation
    setReleaseDate(value: string) {
        this.releaseDate = value;
    }

    @Mutation
    setReleaseCutoff(value: string) {
        this.releaseCutoff = value;
    }

    @Mutation
    setPrimaryMaestro(value: Nullable<number> = null) {
        this.primaryMaestro = value;
    }

    @Mutation
    setSecondaryMaestro(value: Nullable<number> = null) {
        this.secondaryMaestro = value;
    }

    @Mutation
    setDescription(value: string) {
        this.description = value;
    }

    @Action({rawError: true})
    async create() {
        if (this.primaryMaestro) {
            const newRelease = await ReleaseDSModule.create({
                title: this.title,
                managerId: this.primaryMaestro,
                description: this.description,
                secondaryManagerId: this.secondaryMaestro,
                releaseCutoff: this.releaseCutoff,
                releaseDate: this.releaseDate
            });
            return newRelease
        }
    }

    @Action
    clear() {
        this.setTitle('');
        this.setPrimaryMaestro();
        this.setSecondaryMaestro();
        this.setDescription('');
        this.setReleaseDate('');
        this.setReleaseCutoff('');
    }

}
