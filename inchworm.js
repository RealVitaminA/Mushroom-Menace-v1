/**
 * Inchworm entity for Mushroom Menace
 * Represents the segmented inchworm enemies
 */
class InchwormSegment {
    constructor(x, y, width, height, gridX, gridY, isHead = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.gridX = gridX;
        this.gridY = gridY;
        this.isHead = isHead;
        this.active = true;
        this.nextSegment = null; // Reference to the next segment in the chain
    }
}

class Inchworm {
    constructor(startX, startY, segmentWidth, segmentHeight, segmentCount, gridSize) {
        this.segments = [];
        this.direction = 1; // 1 for right, -1 for left
        this.speed = 1; // Base movement speed
        this.moveTimer = 0;
        this.moveInterval = 30; // Update position every 30 game ticks
        this.gridSize = gridSize;
        
        // Create segments
        for (let i = 0; i < segmentCount; i++) {
            const gridX = Math.floor(startX / gridSize) - i;
            const gridY = Math.floor(startY / gridSize);
            const x = gridX * gridSize;
            const y = gridY * gridSize;
            
            const isHead = (i === 0);
            const segment = new InchwormSegment(x, y, segmentWidth, segmentHeight, gridX, gridY, isHead);
            
            // Link segments
            if (i > 0) {
                this.segments[i - 1].nextSegment = segment;
            }
            
            this.segments.push(segment);
        }
    }
    
    update(mushrooms, gameWidth, gameHeight) {
        this.moveTimer++;
        
        if (this.moveTimer >= this.moveInterval) {
            this.moveTimer = 0;
            
            // Process each inchworm chain separately
            let currentHead = this.segments[0];
            let currentChain = [];
            
            while (currentHead) {
                currentChain = [];
                let current = currentHead;
                
                // Collect all segments in this chain
                while (current) {
                    currentChain.push(current);
                    current = current.nextSegment;
                }
                
                // Move the chain
                this.moveChain(currentChain, mushrooms, gameWidth, gameHeight);
                
                // Find the next head (if any)
                currentHead = null;
                for (let i = 0; i < this.segments.length; i++) {
                    if (this.segments[i].isHead && !currentChain.includes(this.segments[i])) {
                        currentHead = this.segments[i];
                        break;
                    }
                }
            }
            
            // Remove inactive segments
            this.segments = this.segments.filter(segment => segment.active);
        }
    }
    
    moveChain(chain, mushrooms, gameWidth, gameHeight) {
        if (chain.length === 0) return;
        
        const head = chain[0];
        
        // Store old positions for following segments
        const oldPositions = chain.map(segment => ({
            x: segment.x,
            y: segment.y,
            gridX: segment.gridX,
            gridY: segment.gridY
        }));
        
        // Move head
        let newGridX = head.gridX + this.direction;
        let newGridY = head.gridY;
        
        // Check for collision with mushroom or edge
        const hitEdge = newGridX < 0 || newGridX * this.gridSize + head.width > gameWidth;
        const hitMushroom = mushrooms.some(mushroom => 
            mushroom.gridX === newGridX && 
            mushroom.gridY === newGridY && 
            !mushroom.isDestroyed()
        );
        
        // If collision, move down and reverse direction
        if (hitEdge || hitMushroom) {
            this.direction *= -1;
            newGridX = head.gridX + this.direction;
            newGridY = head.gridY + 1;
        }
        
        // Update head position
        head.gridX = newGridX;
        head.gridY = newGridY;
        head.x = newGridX * this.gridSize;
        head.y = newGridY * this.gridSize;
        
        // Move body segments to follow the head
        for (let i = 1; i < chain.length; i++) {
            const segment = chain[i];
            segment.gridX = oldPositions[i - 1].gridX;
            segment.gridY = oldPositions[i - 1].gridY;
            segment.x = segment.gridX * this.gridSize;
            segment.y = segment.gridY * this.gridSize;
        }
    }
    
    hitSegment(index) {
        if (index < 0 || index >= this.segments.length || !this.segments[index].active) {
            return false;
        }
        
        const hitSegment = this.segments[index];
        
        // If it's a head, just remove it
        if (hitSegment.isHead) {
            hitSegment.active = false;
            return true;
        }
        
        // If it's a body segment, split the inchworm
        hitSegment.active = false;
        
        // Find the previous segment
        let prevSegment = null;
        for (let i = 0; i < this.segments.length; i++) {
            if (this.segments[i].nextSegment === hitSegment) {
                prevSegment = this.segments[i];
                break;
            }
        }
        
        // Disconnect the chain
        if (prevSegment) {
            prevSegment.nextSegment = null;
        }
        
        // Make the next segment a head if it exists
        if (hitSegment.nextSegment) {
            hitSegment.nextSegment.isHead = true;
        }
        
        return true;
    }
    
    isActive() {
        return this.segments.some(segment => segment.active);
    }
    
    increaseSpeed(amount) {
        this.moveInterval = Math.max(5, this.moveInterval - amount);
    }
}
