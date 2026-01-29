/**
 * Custom commands namespace for the UI framework
 * Provides a plugin system and command registry for extending the framework
 */

/**
 * Command handler function type
 */
export type CommandHandler<TArgs extends unknown[] = unknown[], TReturn = unknown> = (
  ...args: TArgs
) => TReturn | Promise<TReturn>;

/**
 * Command metadata
 */
export interface CommandMetadata {
  description?: string;
  usage?: string;
  examples?: string[];
}

/**
 * Registered command entry
 */
interface CommandEntry<TArgs extends unknown[] = unknown[], TReturn = unknown> {
  handler: CommandHandler<TArgs, TReturn>;
  metadata?: CommandMetadata;
}

/**
 * Command plugin type - object with multiple commands
 */
export type CommandPlugin = Record<string, CommandHandler | { handler: CommandHandler; metadata?: CommandMetadata }>;

/**
 * Command registry class
 */
class CommandRegistry {
  private commands = new Map<string, CommandEntry<any, any>>();

  /**
   * Register a single command
   */
  register<TArgs extends unknown[] = unknown[], TReturn = unknown>(
    name: string,
    handler: CommandHandler<TArgs, TReturn>,
    metadata?: CommandMetadata
  ): void {
    if (this.commands.has(name)) {
      console.warn(`Command "${name}" is already registered. Overwriting...`);
    }
    this.commands.set(name, { handler, metadata });
  }

  /**
   * Register multiple commands as a plugin
   */
  plugin(pluginName: string, commands: CommandPlugin): void {
    for (const [commandName, command] of Object.entries(commands)) {
      const fullName = `${pluginName}:${commandName}`;
      
      if (typeof command === "function") {
        this.register(fullName, command);
      } else {
        this.register(fullName, command.handler, command.metadata);
      }
    }
  }

  /**
   * Execute a command by name
   */
  async execute<TArgs extends unknown[] = unknown[], TReturn = unknown>(
    name: string,
    ...args: TArgs
  ): Promise<TReturn> {
    const command = this.commands.get(name);
    
    if (!command) {
      throw new Error(`Command "${name}" not found. Available commands: ${this.list().join(", ")}`);
    }

    try {
      const result = await command.handler(...args);
      return result as TReturn;
    } catch (error) {
      throw new Error(`Error executing command "${name}": ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Check if a command exists
   */
  has(name: string): boolean {
    return this.commands.has(name);
  }

  /**
   * Get command metadata
   */
  getMetadata(name: string): CommandMetadata | undefined {
    return this.commands.get(name)?.metadata;
  }

  /**
   * List all registered command names
   */
  list(): string[] {
    return Array.from(this.commands.keys());
  }

  /**
   * Get all commands with their metadata
   */
  getAll(): Array<{ name: string; metadata?: CommandMetadata }> {
    return Array.from(this.commands.entries()).map(([name, entry]) => ({
      name,
      metadata: entry.metadata,
    }));
  }

  /**
   * Remove a command
   */
  unregister(name: string): boolean {
    return this.commands.delete(name);
  }

  /**
   * Clear all commands
   */
  clear(): void {
    this.commands.clear();
  }

  /**
   * Get help text for a command or all commands
   */
  help(name?: string): string {
    if (name) {
      const command = this.commands.get(name);
      if (!command) {
        return `Command "${name}" not found.`;
      }
      
      const metadata = command.metadata;
      if (!metadata) {
        return `Command: ${name}\nNo metadata available.`;
      }

      let help = `Command: ${name}\n`;
      if (metadata.description) {
        help += `Description: ${metadata.description}\n`;
      }
      if (metadata.usage) {
        help += `Usage: ${metadata.usage}\n`;
      }
      if (metadata.examples && metadata.examples.length > 0) {
        help += `Examples:\n${metadata.examples.map(ex => `  ${ex}`).join("\n")}\n`;
      }
      return help;
    }

    // Return help for all commands
    const allCommands = this.getAll();
    if (allCommands.length === 0) {
      return "No commands registered.";
    }

    let help = "Available commands:\n\n";
    for (const { name, metadata } of allCommands) {
      help += `  ${name}`;
      if (metadata?.description) {
        help += ` - ${metadata.description}`;
      }
      help += "\n";
    }
    return help;
  }
}

// Create singleton instance
const registry = new CommandRegistry();

/**
 * Register a command (simple registry)
 */
export function register<TArgs extends unknown[] = unknown[], TReturn = unknown>(
  name: string,
  handler: CommandHandler<TArgs, TReturn>,
  metadata?: CommandMetadata
): void {
  registry.register(name, handler, metadata);
}

/**
 * Register a plugin (plugin system)
 */
export function plugin(pluginName: string, commands: CommandPlugin): void {
  registry.plugin(pluginName, commands);
}

/**
 * Execute a command
 */
export async function execute<TArgs extends unknown[] = unknown[], TReturn = unknown>(
  name: string,
  ...args: TArgs
): Promise<TReturn> {
  return registry.execute(name, ...args);
}

/**
 * Check if a command exists
 */
export function has(name: string): boolean {
  return registry.has(name);
}

/**
 * Get command metadata
 */
export function getMetadata(name: string): CommandMetadata | undefined {
  return registry.getMetadata(name);
}

/**
 * List all registered commands
 */
export function list(): string[] {
  return registry.list();
}

/**
 * Get all commands with metadata
 */
export function getAll(): Array<{ name: string; metadata?: CommandMetadata }> {
  return registry.getAll();
}

/**
 * Remove a command
 */
export function unregister(name: string): boolean {
  return registry.unregister(name);
}

/**
 * Clear all commands
 */
export function clear(): void {
  registry.clear();
}

/**
 * Get help text
 */
export function help(name?: string): string {
  return registry.help(name);
}

// Export the registry instance for advanced usage
export { registry };
