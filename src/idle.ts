import { Base, Interaction } from './base';

export class Idle extends Base {

  private repetitive = false;

  /**
   * @param interactions set of interactions which will prevent being idle
   */
  public whenNot(interactions: Interaction[] | Interaction): this {
    this.concatInteractions(interactions);
    return this;
  }

  /**
   * Adds default interactions to decide if user is not interacting with page.
   */
  public whenNotInteractive(): this {
    this.pushDefaultInteractions();
    return this;
  }

  /**
   * Repeat calling idle action for each timeout frame.
   *
   * - Does NOT repeat by default
   */
  public repeat(repeat = true): this {
    this.repetitive = repeat;
    return this;
  }

  /**
   * Restart away timer
   * incase of custom situations other than events on `EventTarget`
   */
  public restart(): this {
    this.onInteraction();
    return this;
  }

  protected onInteraction = () => {
    this.clearInterval();
    this.setInterval();
  }

  protected onInterval = () => {
    this.callback();

    if (!this.repetitive)  {
      this.clearInterval();
    }
  }
}
