export interface ILifeCycle {
    activate?: () => void | Promise<void>
}
