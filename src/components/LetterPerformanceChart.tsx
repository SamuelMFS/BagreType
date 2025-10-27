import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useLocalization } from "@/hooks/useLocalization";

interface LetterStats {
  letter: string;
  average: number;
  best: number;
  worst: number;
  count: number;
}

interface LetterPerformanceChartProps {
  typingData: Array<{
    letter: string;
    reactionTime: number;
    timestamp: number;
    correct: boolean;
  }>;
}

const LetterPerformanceChart = ({ typingData }: LetterPerformanceChartProps) => {
  const [hoveredMetric, setHoveredMetric] = useState<'best' | 'average' | 'worst' | null>(null);
  const { t } = useLocalization();

  // Calculate statistics for each letter
  const calculateLetterStats = (): LetterStats[] => {
    const letterMap = new Map<string, number[]>();
    
    // Group reaction times by letter
    typingData.forEach(data => {
      if (data.correct) { // Only include correct responses
        const letter = data.letter.toLowerCase();
        if (!letterMap.has(letter)) {
          letterMap.set(letter, []);
        }
        letterMap.get(letter)!.push(data.reactionTime);
      }
    });

    // Calculate stats for all 26 letters (a-z) in alphabetical order
    const stats: LetterStats[] = [];
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    
    for (let i = 0; i < alphabet.length; i++) {
      const letter = alphabet[i];
      const times = letterMap.get(letter) || [];
      
      if (times.length > 0) {
        const sortedTimes = [...times].sort((a, b) => a - b);
        stats.push({
          letter,
          average: Math.round(times.reduce((sum, time) => sum + time, 0) / times.length),
          best: sortedTimes[0],
          worst: sortedTimes[sortedTimes.length - 1],
          count: times.length
        });
      } else {
        // Add placeholder for letters with no data
        stats.push({
          letter,
          average: 0,
          best: 0,
          worst: 0,
          count: 0
        });
      }
    }

    return stats; // Already in alphabetical order
  };

  const letterStats = calculateLetterStats();
  const maxReactionTime = letterStats.length > 0 ? Math.max(...letterStats.map(stat => stat.worst)) : 1000;

  const getOpacity = (metric: 'best' | 'average' | 'worst') => {
    if (!hoveredMetric) return 1;
    return hoveredMetric === metric ? 1 : 0.3;
  };

  const getSegmentHeight = (value: number) => {
    return `${(value / maxReactionTime) * 100}%`;
  };

  const getStackedHeight = (value: number) => {
    return `${(value / maxReactionTime) * 100}%`;
  };

  const getBottomPosition = (value: number) => {
    return `${(value / maxReactionTime) * 100}%`;
  };

  if (letterStats.length === 0) {
    return (
      <Card className="p-8 bg-card/90 backdrop-blur-md border-border/50">
        <div className="text-center text-muted-foreground">
          {t('results.charts.letterPerformance.noData')}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-card/90 backdrop-blur-md border-border/50">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-accent mb-2">{t('results.charts.letterPerformance.title')}</h3>
          <p className="text-muted-foreground">
            {t('results.charts.letterPerformance.description')}
          </p>
        </div>

        {/* Interactive Legend */}
        <div className="flex justify-center gap-6 text-sm">
          <div 
            className="flex items-center gap-2 cursor-pointer transition-opacity"
            style={{ opacity: getOpacity('best') }}
            onMouseEnter={() => setHoveredMetric('best')}
            onMouseLeave={() => setHoveredMetric(null)}
          >
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <span className="text-muted-foreground">{t('results.charts.letterPerformance.best')}</span>
          </div>
          <div 
            className="flex items-center gap-2 cursor-pointer transition-opacity"
            style={{ opacity: getOpacity('average') }}
            onMouseEnter={() => setHoveredMetric('average')}
            onMouseLeave={() => setHoveredMetric(null)}
          >
            <div className="w-3 h-3 bg-blue-400 rounded"></div>
            <span className="text-muted-foreground">{t('results.charts.letterPerformance.average')}</span>
          </div>
          <div 
            className="flex items-center gap-2 cursor-pointer transition-opacity"
            style={{ opacity: getOpacity('worst') }}
            onMouseEnter={() => setHoveredMetric('worst')}
            onMouseLeave={() => setHoveredMetric(null)}
          >
            <div className="w-3 h-3 bg-red-400 rounded"></div>
            <span className="text-muted-foreground">{t('results.charts.letterPerformance.worst')}</span>
          </div>
        </div>

        {/* Vertical Stacked Bar Chart */}
        <div className="w-full">
          <div className="flex items-end justify-center gap-0.5 h-80">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between h-full pr-2 text-xs text-muted-foreground flex-shrink-0">
              <div>{maxReactionTime}ms</div>
              <div>{Math.round(maxReactionTime * 0.75)}ms</div>
              <div>{Math.round(maxReactionTime * 0.5)}ms</div>
              <div>{Math.round(maxReactionTime * 0.25)}ms</div>
              <div>0ms</div>
            </div>
            
            {/* Chart bars */}
            <div className="flex items-end gap-0.5">
              {letterStats.map((stat) => (
                <div key={stat.letter} className="flex flex-col items-center gap-0.5">
                  {/* Stacked Bar */}
                  <div className={`w-6 h-64 rounded-t-sm relative overflow-hidden ${
                    stat.count === 0 ? 'bg-muted/10' : 'bg-muted/20'
                  }`}>
                    {stat.count > 0 && (
                      <>
                        {/* Worst Segment (bottom layer - largest) */}
                        <div 
                          className="absolute bottom-0 left-0 right-0 bg-red-400 transition-opacity duration-200 rounded-t-sm"
                          style={{ 
                            height: `${(stat.worst / maxReactionTime) * 100}%`,
                            opacity: getOpacity('worst')
                          }}
                          title={`Worst: ${stat.worst}ms`}
                        ></div>
                        
                        {/* Average Segment (middle layer) */}
                        <div 
                          className="absolute bottom-0 left-0 right-0 bg-blue-400 transition-opacity duration-200 rounded-t-sm"
                          style={{ 
                            height: `${(stat.average / maxReactionTime) * 100}%`,
                            opacity: getOpacity('average')
                          }}
                          title={`Average: ${stat.average}ms`}
                        ></div>
                        
                        {/* Best Segment (top layer - smallest) */}
                        <div 
                          className="absolute bottom-0 left-0 right-0 bg-green-400 transition-opacity duration-200 rounded-t-sm"
                          style={{ 
                            height: `${(stat.best / maxReactionTime) * 100}%`,
                            opacity: getOpacity('best')
                          }}
                          title={`Best: ${stat.best}ms`}
                        ></div>
                      </>
                    )}
                  </div>
                  
                  {/* Letter Label */}
                  <div className="w-6 text-center">
                    <div className={`text-xs font-bold mb-0.5 ${
                      stat.count === 0 ? 'text-muted-foreground/50' : 'text-primary'
                    }`}>
                      {stat.letter.toUpperCase()}
                    </div>
                    {stat.count > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {stat.count}×
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
          <div className="text-center">
            <div className="text-lg font-semibold text-green-400">
              {Math.min(...letterStats.map(s => s.best))}ms
            </div>
            <div className="text-sm text-muted-foreground">{t('results.charts.letterPerformance.overallBest')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-400">
              {Math.round(letterStats.reduce((sum, s) => sum + s.average, 0) / letterStats.length)}ms
            </div>
            <div className="text-sm text-muted-foreground">{t('results.charts.letterPerformance.overallAverage')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-red-400">
              {Math.max(...letterStats.map(s => s.worst))}ms
            </div>
            <div className="text-sm text-muted-foreground">{t('results.charts.letterPerformance.overallWorst')}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LetterPerformanceChart;