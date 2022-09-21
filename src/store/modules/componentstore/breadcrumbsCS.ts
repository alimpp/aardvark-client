import { ApplicationDSModule, NuggetDSModule, ProjectDSModule, ReleaseDSModule, SprintsViewDSModule } from '@/store';
import { Module, VuexModule } from 'vuex-module-decorators';
import NuggetDM from '@/datamodels/nuggetDM';
import SprintDM from '@/datamodels/sprintDM';
import ReleaseDM from '@/datamodels/releaseDM';
import ProjectDM from '@/datamodels/projectDM';
import { EntityType } from '../datastore/applicationDS';

export type IBreadCrumb = {
	title: Required<Readonly<string>>
	sprintTitle?: string
	nuggetTitle?: string
	releaseTitle?: string
	projectTitle?: string
};

@Module({ name: 'breadcrumbscs', namespaced: true, stateFactory: false, preserveState: true })
export class BreadCrumbsCS extends VuexModule {

	get selectedEntityType() {
		return ApplicationDSModule.selectedEntityType;
	}

	get currentNugget(): NuggetDM {
		return NuggetDSModule.currentNugget;
	}

	get currentSprint(): SprintDM {
		return SprintsViewDSModule.currentSprintView;
	}

	get currentProject(): ProjectDM {
		return ProjectDSModule.currentProject;
	}

	get currentRelease(): ReleaseDM {
		return ReleaseDSModule.currentRelease;
	}

}