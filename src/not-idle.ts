import { Base, Interaction } from './base';

export class NotIdle extends Base {

  protected wasInteractiveLastPeriod: boolean;
  protected immediate = false;

  /**
   * @param interactions set of interactions which will prevent being idle
   */
  public when(interactions: Interaction[] | Interaction): this {
    this.concatInteractions(interactions);
    return this;
  }

  /**
   * Adds default interactions to decide if user is not interacting with page.
   */
  public whenInteractive(): this {
    this.pushDefaultInteraction();
    return this;
  }

  /**
   * Runs not idle action immediately when an interaction happens
   * so does not wait until end of the current period to run.
   *
   * - Does NOT run immediately by default
   */
  public immediately(immediate = true): this {
    this.immediate = immediate;
    return this;
  }

  protected listenerAction = () => {
    this.wasInteractiveLastPeriod = true;
  }

  protected tick = () => {
    this.timer += 1;

    if (this.immediate && this.wasInteractiveLastPeriod) {
      this.callback();
      this.wasInteractiveLastPeriod = false;
    }

    if (this.timer === this.timeout) {
      this.timer = 0;
      if (!this.immediate && this.wasInteractiveLastPeriod) {
        this.callback();
        this.wasInteractiveLastPeriod = false;
      }
    }
  }
}
