export interface Interaction {
  target: EventTarget;
  events: string[];
}

export class Idle {
  protected timer = 0;
  protected intervalId: number;

  protected interactions: Interaction[] = [];
  protected onIdle: () => void;
  protected timeout: number;
  protected factor: number;
  protected repetitive = false;

  /**
   * Sets time after which it's idle if no interaction occurs.
   *
   * @param factor amount of miliseconds `timeout` represents, default 60000 (a minute)
   */
  public for(timeout: number, factor = 60000): this {
    this.timeout = timeout;
    this.factor = factor;
    return this;
  }

  /**
   * @param interactions set of interactions which will prevent being idle
   */
  public whenNot(interactions: Interaction[] | Interaction): this {
    this.interactions = this.interactions
      .concat(interactions);
    return this;
  }

  /**
   * Adds default interactions to decide if user is not interacting with page.
   */
  public whenNotInteractive(): this {
    this.interactions.push({
      events: [
        'click',
        'mousemove',
        'mouseenter',
        'keydown',
        'scroll',
        'touchstart',
      ],
      target: document,
    });
    return this;
  }

  public do(onIdle: () => void): this {
    this.onIdle = onIdle;
    return this;
  }

  /**
   * Repeat calling idle action for each timeout frame.
   *
   * - Does not repeat by default
   */
  public repeat(repeat = true): this {
    this.repetitive = repeat;
    return this;
  }

  public start(): this {
    if (this.interactions.length === 0) {
      throw Error('There is no interaction to watch!');
    }

    this.addListeners();
    this.setInterval();
    return this;
  }

  public stop(): this {
    this.removeListeners();
    this.clearInterval();
    return this;
  }

  /**
   * Resets away timer, useful for resetting manually
   * incase of custom situations other than events on `EventTarget`
   */
  public reset(): this {
    this.resetTimer();
    return this;
  }

  protected addListeners(): void {
    for (const interaction of this.interactions) {
      for (const event of interaction.events) {
        interaction.target.addEventListener(event, this.resetTimer);
      }
    }
  }

  protected removeListeners(): void {
    for (const interaction of this.interactions) {
      for (const event of interaction.events) {
        interaction.target.removeEventListener(event, this.resetTimer);
      }
    }
  }

  protected resetTimer = () => {
    this.timer = 0;
    this.clearInterval();
    this.setInterval();
  }

  protected clearInterval(): void {
    clearInterval(this.intervalId);
  }

  protected setInterval(): void {
    this.intervalId = setInterval(this.tick, this.factor);
  }

  protected tick = () => {
    this.timer += 1;
    if (this.timer === this.timeout) {
      this.onIdle();
      if (!this.repetitive) {
        this.stop();
      } else {
        this.reset();
      }
    }
  }

}
