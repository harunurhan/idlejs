export interface Interaction {
  target: EventTarget;
  events: string[];
}

const DEFAULT_DOCUMENT_EVENTS = [
  'click',
  'mousemove',
  'mouseenter',
  'keydown',
  'scroll',
  'touchstart',
];

export abstract class Base {
  protected abstract onInteraction: () => void;
  protected abstract onInterval: () => void;
  protected callback: () => void;

  private interactions: Interaction[] = [];
  private timeout: number;
  private factor: number;

  private activeIntervalId: number;

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
      throw new Error('There is no interaction to watch!');
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
        interaction.target.addEventListener(event, this.onInteraction);
      }
    }
  }

  protected removeListeners(): void {
    for (const interaction of this.interactions) {
      for (const event of interaction.events) {
        interaction.target.removeEventListener(event, this.onInteraction);
      }
    }
  }

  protected pushDefaultInteractions(): void {
    this.interactions.push({
      events: DEFAULT_DOCUMENT_EVENTS,
      target: document,
    });
  }

  protected concatInteractions(interactions: Interaction[] | Interaction): void {
    this.interactions = this.interactions.concat(interactions);
  }

  protected clearInterval(): void {
    window.clearInterval(this.activeIntervalId);
  }

  protected setInterval(): void {
    this.activeIntervalId = window.setInterval(this.onInterval, this.timeout * this.factor);
  }
}
