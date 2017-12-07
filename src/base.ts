export interface Interaction {
  target: EventTarget;
  events: string[];
}

const defaultDocumentEvents = [
  'click',
  'mousemove',
  'mouseenter',
  'keydown',
  'scroll',
  'touchstart',
];

export abstract class Base {

  protected abstract listenerAction: () => void;
  protected abstract tick: () => void;

  protected timer = 0;
  protected intervalId: number;

  protected interactions: Interaction[] = [];
  protected timeout: number;
  protected factor: number;
  protected callback: () => void;

  /**
   * Sets time after which it's idle if no interaction occurs.
   *
   * @param factor amount of miliseconds `timeout` represents, default 60000 (a minute)
   */
  public within(timeout: number, factor = 60000): this {
    this.timeout = timeout;
    this.factor = factor;
    return this;
  }

  public do(callback: () => void): this {
    this.callback = callback;
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

  protected addListeners(): void {
    for (const interaction of this.interactions) {
      for (const event of interaction.events) {
        interaction.target.addEventListener(event, this.listenerAction);
      }
    }
  }

  protected removeListeners(): void {
    for (const interaction of this.interactions) {
      for (const event of interaction.events) {
        interaction.target.removeEventListener(event, this.listenerAction);
      }
    }
  }

  protected clearInterval(): void {
    clearInterval(this.intervalId);
  }

  protected setInterval(): void {
    this.intervalId = setInterval(this.tick, this.factor);
  }

  protected pushDefaultInteraction(): void {
    this.interactions.push({
      events: defaultDocumentEvents,
      target: document,
    });
  }

  protected concatInteractions(interactions: Interaction[] | Interaction): void {
    this.interactions = this.interactions
      .concat(interactions);
  }

}
