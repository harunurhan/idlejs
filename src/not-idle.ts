import { Base, Interaction } from './base';

export class NotIdle extends Base {

  protected immediate = false;
  private interactedWithin = false;

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
    this.pushDefaultInteractions();
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

  protected onInteraction = () => {
    if (!this.interactedWithin && this.immediate) {
      this.callback();
    }
    this.interactedWithin = true;
  }

  protected onInterval = () => {
    if (this.interactedWithin && !this.immediate) {
      this.callback();
    }

    this.interactedWithin = false;
  }
}
