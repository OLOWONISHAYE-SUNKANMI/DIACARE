import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { FixedSizeList as List, VariableSizeList, ListChildComponentProps, ListOnScrollProps } from 'react-window';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight?: number | ((index: number) => number);
  height: number;
  width?: string | number;
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
  overscan?: number;
  className?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  isLoading?: boolean;
  onScroll?: (scrollOffset: number) => void;
  estimatedItemSize?: number;
}

export function VirtualizedList<T>({
  items,
  itemHeight = 60,
  height,
  width = '100%',
  renderItem,
  overscan = 5,
  className,
  emptyMessage = "Aucun élément à afficher",
  loadingMessage = "Chargement...",
  isLoading = false,
  onScroll,
  estimatedItemSize = 60
}: VirtualizedListProps<T>) {
  const [scrollOffset, setScrollOffset] = useState(0);
  
  // Détermine si on utilise une hauteur fixe ou variable
  const isFixedHeight = typeof itemHeight === 'number';

  // Composant pour rendre chaque élément
  const ItemRenderer = useCallback(({ index, style }: ListChildComponentProps) => {
    const item = items[index];
    if (!item) return null;

    return (
      <div style={style}>
        {renderItem(item, index, style)}
      </div>
    );
  }, [items, renderItem]);

  // Gestion du scroll
  const handleScroll = useCallback((props: ListOnScrollProps) => {
    setScrollOffset(props.scrollOffset);
    onScroll?.(props.scrollOffset);
  }, [onScroll]);

  // Optimisation pour les grandes listes
  const memoizedItems = useMemo(() => items, [items]);

  if (isLoading) {
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        style={{ height, width }}
      >
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  if (memoizedItems.length === 0) {
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        style={{ height, width }}
      >
        <div className="text-center">
          <div className="text-4xl mb-2">📋</div>
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  if (isFixedHeight) {
    return (
      <div className={className}>
        <List
          height={height}
          width={width}
          itemCount={memoizedItems.length}
          itemSize={itemHeight as number}
          overscanCount={overscan}
          onScroll={handleScroll}
        >
          {ItemRenderer}
        </List>
      </div>
    );
  }

  return (
    <div className={className}>
      <VariableSizeList
        height={height}
        width={width}
        itemCount={memoizedItems.length}
        itemSize={itemHeight as (index: number) => number}
        estimatedItemSize={estimatedItemSize}
        overscanCount={overscan}
        onScroll={handleScroll}
      >
        {ItemRenderer}
      </VariableSizeList>
    </div>
  );
}

// Hook pour observer la visibilité d'un élément dans la liste virtualisée
export function useVirtualizedListItem(index: number, scrollOffset: number, itemHeight: number) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const itemTop = index * itemHeight;
    const itemBottom = itemTop + itemHeight;
    const viewportTop = scrollOffset;
    const viewportBottom = scrollOffset + window.innerHeight;

    const visible = itemBottom >= viewportTop && itemTop <= viewportBottom;
    setIsVisible(visible);
  }, [index, scrollOffset, itemHeight]);

  return isVisible;
}

// Composant optimisé pour les éléments de liste
export const VirtualizedListItem = React.memo<{
  children: React.ReactNode;
  className?: string;
}>(({ children, className }) => {
  return (
    <div className={`${className} will-change-transform`}>
      {children}
    </div>
  );
});

VirtualizedListItem.displayName = 'VirtualizedListItem';