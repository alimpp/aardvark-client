<template>
  <div
    id="CompanyCalendar"
    class="main-container"
  >
    <div class="content d-flex max-height-moduletab-content">
      <div class="calendar-container">
        <calendar
          :eventCategories="holidayCategories"
          :events="decoratedHolidays"
          :class="isDarkMode"
          :offDays="offDays"
          ref="calendar"
          class="calendar"
        />
        <div class="days">
          <b class="pt-3">Weekly Off-Days</b>
          <CoreCheckBox
            v-for="day of daysOfWeek"
            :key="day.id"
            v-model="day.isOff"
            @input="toggleOffDay(day)"
            class="mb-3"
          >{{day.name}}</CoreCheckBox>
        </div>
      </div>
      <CoreTable
        ref="table"
        class="table maz-flex-1"
        :datasource="dataSource"
        :loading="$wait.is(waitState.ACTION_SETTINGSCOMPANYCALENDAR_LOADING)"
      />
    </div>

    <CompanyCalendarDetail class="form" />
  </div>
</template>

<script lang="ts">
import { Ref, Component } from 'vue-property-decorator';
import { SettingsCompanyCalendarCSModule, ProfileDSModule, CreateHolidayCSModule } from "@/store";
import CoreInput from "@/components/Core/CoreInput.vue";
import CorePicker from "@/components/Core/CorePicker/CorePicker.vue";
import CoreSelect from "@/components/Core/CoreSelect.vue";
import CoreCheckBox from "@/components/Core/CoreCheckBox.vue";
import { Calendar } from "vue-sweet-calendar";
import "vue-sweet-calendar/dist/SweetCalendar.css";
import CoreTable from "@/components/Core/Table/CoreTable.vue";
import TableCS from "@/store/modules/componentstore/base/tableCS";
import TableRow from "@/datamodels/base/tableRow";
import CompanyCalendarDetail from "./SettingsDetail/CompanyCalendarDetail.vue";
import moment from "moment";
import { dateISOFormat } from "@/utils/date";
import {DAYS_OF_WEEK} from "@/utils/constants";
import BaseSetting from '@/components/Settings/Base/BaseSetting.vue'

@Component({
  name: "SettingsCompanyCalendar",
  components: {
    CoreInput,
    CorePicker,
    CoreSelect,
    CoreCheckBox,
    Calendar,
    CoreTable,
    CompanyCalendarDetail,
  },
})
export default class SettingsCompanyCalendar extends BaseSetting {
  holidayCategories = [
    { id: 1, selected: true, textColor: "white", backgroundColor: "#194173" },
    { id: 2, selected: false, textColor: "white", backgroundColor: "#0B2B53" },
  ];

  @Ref('table') table!: CoreTable;


  get dataSource(): TableCS<TableRow> {
    return SettingsCompanyCalendarCSModule;
  }

  //Overriding Parent Method
  get defaultSelectedRow(): TableRow | null {
      return this.dataSource.tableData?.[0];
  }

  get isDarkMode() {
    return ProfileDSModule.isDarkMode ? "calendar-dark" : "calendar";
  }

  get decoratedHolidays() {
    return SettingsCompanyCalendarCSModule.decoratedHolidays;
  }

  get daysOfWeek() {
    const days =  DAYS_OF_WEEK.map(day => {
      const isOff =  SettingsCompanyCalendarCSModule.weeklyOffDays.some(offDay => offDay.title === `${day.name}-company-wide`)
      return {
        name: day.name,
        id: day.id,
        isOff: isOff
        }
    })
    return days;
  }

  get offDays() {
    return this.daysOfWeek.reduce((acc: any, day) => {
      if (day.isOff) {
        acc.push(day.id);
      }
      return acc;
    }, []);
  }

  async toggleOffDay(day) {
    const weeklyHoliday = this.daysOfCurrentWeek.find(item => item.day === day.name)
    const currentOffDays = SettingsCompanyCalendarCSModule.weeklyOffDays.filter(item => item.removedAt === '')
    const deletableHoliday = currentOffDays.find(item => item.title === `${weeklyHoliday.day}-company-wide`)
    if (deletableHoliday) {
      SettingsCompanyCalendarCSModule.delete(deletableHoliday.id)
    } else {
      CreateHolidayCSModule.setStartDate(dateISOFormat(weeklyHoliday.date))
      CreateHolidayCSModule.setEndDate(dateISOFormat(weeklyHoliday.date))
      CreateHolidayCSModule.setRepeat('weekly')
      CreateHolidayCSModule.setTitle(`${weeklyHoliday.day}-company-wide`)
      await CreateHolidayCSModule.create()
      CreateHolidayCSModule.clear()
    }
  }

  get daysOfCurrentWeek() {
    const currentDate = moment();
    const weekStart = currentDate.clone().startOf("isoWeek");
    const days: any = []
    for (let i = 0; i <= 6; i++) {
      days.push({date: moment(weekStart).add(i, "days").format(), day: moment(weekStart).add(i, "days").format('dddd')});
    }
    return days
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";
#CompanyCalendar {
  .content {
    flex-flow: row;
    .table {
      flex-grow: 4;
      ::v-deep .table-title {
        min-width: inherit;
      }
      ::v-deep .table-line {
        min-width: inherit;
      }
    }
    .calendar-container {
      flex-grow: 1;
      .calendar-dark {
        ::v-deep .container .body .day-container .day {
          color: $brand-color;
        }
        ::v-deep .container .body .day-name {
          color: white;
        }
      }
      .days {
        b {
          grid-column: 1/3;
          padding-bottom: 15px;
          color: $brand-color;
        }
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(5, auto);
      }
      .calendar {
        ::v-deep .container {
          padding-right: 0;
          padding-left: 0;
        }
      }
    }
  }
}
</style>
