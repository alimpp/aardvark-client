<template>
  <CorePopper tag="div">
    <span slot="reference" class="d-flex material-icons">{{status}}</span>
    <div slot="popper">
      <div v-for="socket in sockets" :key="socket.key">
        <span class="text-capitalize">{{socket.key}}</span>: {{currentStatus(socket)}}
      </div>
    </div>
  </CorePopper>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import CorePopper from '@/components/Core/CorePopper.vue';
import { ApplicationDSModule } from '@/store';
import { WebsocketConnection } from '@/utils/websocket';

@Component({
  name: 'SocketStatus',
  components: {CorePopper}
})
export default class SocketStatus extends Vue {

  currentStatus(socket: WebsocketConnection) {
    switch (true) {
      case socket.isStale:
        return 'Stale'
      case socket.isReconnecting:
        return 'Reconnecting'
      case socket.isOnline:
        return 'Online'
      default:
        return 'Offline'
    }
    //
  }

  get sockets() {
    return [this.dolphinSocket, this.jaguarSocket].filter(socket => !!socket);
  }

  get jaguarSocket() {
    return ApplicationDSModule.jaguarSocket;
  }

  get dolphinSocket() {
    return ApplicationDSModule.dolphinSocket
  }

  get isJaguarStale() {
    return this.jaguarSocket?.isStale
  }

  get isJaguarOnline() {
    return this.jaguarSocket?.isOnline
  }

  get isDolphinStale() {
    return this.dolphinSocket?.isStale
  }

  get isDolphinOnline() {
    return this.dolphinSocket?.isOnline
  }

  get status() {
    if(!this.isDolphinOnline && !this.isJaguarOnline) return 'wifi_tethering_off';
    if(!this.isJaguarOnline || this.isJaguarStale || !this.isDolphinOnline || this.isDolphinStale) return 'wifi_tethering_error';
    return 'wifi_tethering';
  }

}
</script>

<style lang="scss">
.material-icons{
  font-size: 30px;
  cursor: pointer;
  user-select: none;
}
</style>