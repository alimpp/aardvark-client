import {IBadgeCountCS} from "@/store/modules/componentstore/badgeCountCS";
import { JsonConverter, JsonCustomConvert, JsonObject, JsonProperty } from "json2typescript";
import Datamodel from './base/datamodel';
import { PartialRecord } from '@/utils/generics';

interface NuggetCounts {
  inbox?: number
  nuggetlastthirtydays?: number
  released?: number
  subscribed?: number
  unread?: number
  'goodnews-upcoming'?: number
  'goodnews-archived'?: number
  'goodnews-backlog'?: number
  'goodnews-triage'?: number
  'badnews-overduetriage'?: number
}

interface AssignmentCounts {
  'goodnews-approvaldue'?: number
  'goodnews-approvalduecount'?: number
  'teamlead-approvaldue'?: number
  'badnews-delayednuggets'?: number
  'teamlead-delayednuggets'?: number
  'journal-report'?: number
  'teamlead-journalreports'?: number
  'teamlead-overdueestimates'?: number
  'teamlead-overduejournals'?: number
  complete?: number
  inProgressNuggets?: number
  inProgressNuggetsNotSubmitted?: number
  needEstimate?: number
  newlyAssigned?: number
  'badnews-overdueestimates'?: number
  upcomingNuggets?: number
}

@JsonConverter
class NuggetCountsConverter implements JsonCustomConvert<PartialRecord<keyof IBadgeCountCS, number> | NuggetCounts> {
  serialize(data: NuggetCounts) {
    return data;
  }
  deserialize(data: NuggetCounts) {
    const obj: PartialRecord<keyof IBadgeCountCS, number> = {};
    if(typeof data.unread !== 'undefined') obj.nuggetUnread = data.unread;
    if(typeof data.nuggetlastthirtydays !== 'undefined') obj.nuggetLastThirtyDays = data.nuggetlastthirtydays;
    if(typeof data.subscribed !== 'undefined') obj.nuggetSubscribed = data.subscribed;
    if(typeof data.released !== 'undefined') obj.nuggetReleased = data.released;
    if(typeof data.unread !== 'undefined') obj.inboxNuggetUnread = data.unread;
    if(typeof data['goodnews-upcoming'] !== 'undefined') obj.goodNewsUpcoming = data['goodnews-upcoming'];
    if(typeof data["goodnews-triage"] !== 'undefined') obj.goodNewsTriage = data["goodnews-triage"];
    if(typeof data["goodnews-backlog"] !== 'undefined') obj.goodNewsBacklog = data["goodnews-backlog"];
    if(typeof data[" goodnews-archived"] !== 'undefined') obj.goodNewsArchive = data[" goodnews-archived"];
    if(typeof data["badnews-overduetriage"] !== 'undefined') obj.badNewsOverdueTriage = data["badnews-overduetriage"];
    return obj
  }
}

@JsonConverter
class AssignmentCountsConverter implements JsonCustomConvert<PartialRecord<keyof IBadgeCountCS, number> | AssignmentCounts> {
  serialize(data: AssignmentCounts) {
    return data;
  }
  deserialize(data: AssignmentCounts) {
    const obj: PartialRecord<keyof IBadgeCountCS, number> = {};
    if(typeof data.inProgressNuggets !== 'undefined') obj.assignmentInProgress = data.inProgressNuggets;
    if(typeof data.inProgressNuggetsNotSubmitted !== 'undefined') obj.assignmentInProgressDue = data.inProgressNuggetsNotSubmitted;
    if(typeof data.upcomingNuggets !== 'undefined') obj.assignmentUpcoming = data.upcomingNuggets;
    if(typeof data.needEstimate !== 'undefined') obj.assignmentNeedEstimate = data.needEstimate;
    if(typeof data.newlyAssigned !== 'undefined') obj.assignmentUpcomingEstimates = data.newlyAssigned;
    if(typeof data.complete !== 'undefined') obj.assignmentCompleted = data.complete;
    if(typeof data['badnews-overdueestimates'] !== 'undefined') obj.badNewsOverdueEstimate = data['badnews-overdueestimates'];
    if(typeof data["teamlead-approvaldue"] !== 'undefined') obj.leadNeedApproval = data["teamlead-approvaldue"];
    if(typeof data["teamlead-delayednuggets"] !== 'undefined') obj.leadDelayedNuggets = data["teamlead-delayednuggets"];
    if(typeof data["teamlead-overdueestimates"] !== 'undefined') obj.leadOverdueEstimate = data["teamlead-overdueestimates"];
    if(typeof data["teamlead-overduejournals"] !== 'undefined') obj.leadOverdueJournal = data["teamlead-overduejournals"];
    if(typeof data["teamlead-journalreports"] !== 'undefined') obj.leadJournalReport = data["teamlead-journalreports"];
    if(typeof data["goodnews-approvaldue"] !== 'undefined') obj.goodNewsNeedApproval = data["goodnews-approvaldue"];
    if(typeof data["badnews-delayednuggets"] !== 'undefined') obj.badNewsDelayedNuggets = data["badnews-delayednuggets"];
    if(typeof data["journal-report"] !== 'undefined') obj.badNewsOverdueTimecard = data["journal-report"];
    return obj
  }
}

@JsonObject('CountsDM')
export default class CountsDM extends Datamodel {
  @JsonProperty("Assignments", AssignmentCountsConverter, true) assignments: PartialRecord<keyof IBadgeCountCS, number> = {};
  @JsonProperty("Nuggets", NuggetCountsConverter, true) nuggets: PartialRecord<keyof IBadgeCountCS, number> = {};
}
