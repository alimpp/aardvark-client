import CountsDM from '@/datamodels/countsDM';
import SocketAssignmentDM from '@/datamodels/socketAssignmentDM';
import SocketNuggetDM from '@/datamodels/socketNuggetDM';
import SocketNuggetPhaseDM from '@/datamodels/socketNuggetPhaseDM';
import SocketProjectDM from '@/datamodels/socketProjectDM';
import SocketReleaseDM from '@/datamodels/socketReleaseDM';
import SocketSprintDM from '@/datamodels/socketSprintDM';
import {ApplicationDSModule} from '@/store';
import SocketUserDM from '@/datamodels/socketUserDM';
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators"
import SocketWorkflowDM from '@/datamodels/socketWorkflowDM';

@Module({ name: "dolphinsocketds", namespaced: true })
export class DolphinSocketDS extends VuexModule implements IDolphinSocketDS {
  public counts = new CountsDM();
  public nugget = new SocketNuggetDM();
  public assignment = new SocketAssignmentDM();
  public project = new SocketProjectDM();
  public release = new SocketReleaseDM();
  public sprint = new SocketSprintDM();
  public nuggetPhase = new SocketNuggetPhaseDM();
  public user = new SocketUserDM();
  public workflow = new SocketWorkflowDM();

  @Mutation
  private setCounts(counts: CountsDM) {
    this.counts = counts;
  }

  @Mutation
  private setNugget(nugget: SocketNuggetDM) {
    this.nugget = nugget;
  }
  
  @Mutation
  private setAssignment(assignment: SocketAssignmentDM) {
    this.assignment = assignment;
  }
  
  @Mutation
  private setProject(project: SocketProjectDM) {
    this.project = project;
  }
  
  @Mutation
  private setNuggetPhase(nuggetPhase: SocketNuggetPhaseDM) {
    this.nuggetPhase = nuggetPhase;
  }
  
  @Mutation
  private setRelease(release: SocketReleaseDM) {
    this.release = release;
  }
  
  @Mutation
  private setSprint(sprint: SocketSprintDM) {
    this.sprint = sprint;
  }
  
  @Mutation
  private setUser(user: SocketUserDM) {
    this.user = user;
  }

  @Mutation
  private setWorkflow(workflow: SocketWorkflowDM) {
    this.workflow = workflow;
  }

  @Action({rawError: true})
  public receiveCounts(data: CountsDM) {
    this.setCounts(data);
  }

  @Action({rawError: true})
  public receiveNugget(data: SocketNuggetDM) {
    this.setNugget(data);
  }
  
  @Action({rawError: true})
  public receiveAssignment(data: SocketAssignmentDM) {
    this.setAssignment(data);
  }
  
  @Action({rawError: true})
  public receiveProject(data: SocketProjectDM) {
    this.setProject(data);
  }
  
  @Action({rawError: true})
  public receiveNuggetPhase(data: SocketNuggetPhaseDM) {
    this.setNuggetPhase(data);
  }
  
  @Action({rawError: true})
  public receiveRelease(data: SocketReleaseDM) {
    this.setRelease(data);
  }
  
  @Action({rawError: true})
  public receiveSprint(data: SocketSprintDM) {
    this.setSprint(data);
  }
  
  @Action({rawError: true})
  public loadBadgeCounts() {
    ApplicationDSModule.dolphinSocket?.send(JSON.stringify({data: null, action: "zone_counts"}));
  }
  
  @Action({rawError: true})
  public receiveUser(data: SocketUserDM) {
    this.setUser(data);
  }

  @Action({rawError: true})
  public receiveWorkflow(data: SocketWorkflowDM) {
    this.setWorkflow(data);
  }

}

export interface IDolphinSocketDS {
  counts: CountsDM
  nugget: SocketNuggetDM
  assignment: SocketAssignmentDM
  project: SocketProjectDM
  release: SocketReleaseDM
  sprint: SocketSprintDM
  nuggetPhase: SocketNuggetPhaseDM
  workflow: SocketWorkflowDM
}
