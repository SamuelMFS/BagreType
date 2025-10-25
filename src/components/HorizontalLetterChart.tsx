import { useState } from "react";
import { useLocalization } from "@/hooks/useLocalization";

interface TypingData {
  letter: string;
  reactionTime: number;
  timestamp: number;
  correct: boolean;
}

interface HorizontalLetterChartProps {
  typingData: TypingData[];
}

const HorizontalLetterChart = ({ typingData }: HorizontalLetterChartProps) => {
  const [hoveredMetric, setHoveredMetric] = useState<'best' | 'average' | 'worst' | null>(null);
  const { t } = useLocalization();

  const calculateLetterStats = () => {
    const letterMap = new Map<string, number[]>();
    
    // Group reaction times by letter
    typingData.forEach(data => {
      if (data.correct) {
        const letter = data.letter.toLowerCase();
        if (!letterMap.has(letter)) {
          letterMap.set(letter, []);
        }
        letterMap.get(letter)!.push(data.reactionTime);
      }
    });

    // Calculate stats for all letters a-z
    const letterStats = [];
    for (let i = 0; i < 26; i++) {
      const letter = String.fromCharCode(97 + i); // a-z
      const times = letterMap.get(letter) || [];
      
      if (times.length > 0) {
        letterStats.push({
          letter,
          count: times.length,
          best: Math.min(...times),
          average: Math.round(times.reduce((sum, time) => sum + time, 0) / times.length),
          worst: Math.max(...times)
        });
      } else {
        letterStats.push({
          letter,
          count: 0,
          best: 0,
          average: 0,
          worst: 0
        });
      }
    }

    return letterStats;
  };

  const letterStats = calculateLetterStats();
  const maxReactionTime = Math.max(...letterStats.map(s => s.worst).filter(w => w > 0));

  const getOpacity = (type: 'best' | 'average' | 'worst') => {
    if (!hoveredMetric) return 0.7;
    return hoveredMetric === type ? 1 : 0.3;
  };

  // Split letters: a-m (left) and n-z (right)
  const leftLetters = letterStats.slice(0, 13); // a-m
  const rightLetters = letterStats.slice(13); // n-z

  return (
    <div className="space-y-4">
      {/* Chart Title */}
      <div className="text-center">
        <h4 className="text-lg font-semibold text-primary">{t('results.charts.horizontalChart.title')}</h4>
        <p className="text-sm text-muted-foreground">{t('results.charts.horizontalChart.description')}</p>
      </div>

      {/* Interactive Legend */}
      <div className="flex justify-center gap-6">
        <div 
          className="flex items-center gap-2 cursor-pointer transition-opacity"
          style={{ opacity: getOpacity('best') }}
          onMouseEnter={() => setHoveredMetric('best')}
          onMouseLeave={() => setHoveredMetric(null)}
        >
          <div className="w-3 h-3 bg-green-400 rounded"></div>
          <span className="text-muted-foreground">{t('results.charts.horizontalChart.best')}</span>
        </div>
        <div 
          className="flex items-center gap-2 cursor-pointer transition-opacity"
          style={{ opacity: getOpacity('average') }}
          onMouseEnter={() => setHoveredMetric('average')}
          onMouseLeave={() => setHoveredMetric(null)}
        >
          <div className="w-3 h-3 bg-blue-400 rounded"></div>
          <span className="text-muted-foreground">{t('results.charts.horizontalChart.average')}</span>
        </div>
        <div 
          className="flex items-center gap-2 cursor-pointer transition-opacity"
          style={{ opacity: getOpacity('worst') }}
          onMouseEnter={() => setHoveredMetric('worst')}
          onMouseLeave={() => setHoveredMetric(null)}
        >
          <div className="w-3 h-3 bg-red-400 rounded"></div>
          <span className="text-muted-foreground">{t('results.charts.horizontalChart.worst')}</span>
        </div>
      </div>

      {/* Horizontal Chart */}
      <div className="w-full">
        <div className="flex gap-8">
          {/* Left Side: A-M */}
          <div className="flex-1">
            <div className="text-center mb-2 text-sm font-semibold text-primary">A-M</div>
            <div className="space-y-1">
              {leftLetters.map((stat) => (
                <div key={stat.letter} className="flex items-center gap-2">
                  {/* Letter Label */}
                  <div className="w-6 text-center">
                    <div className={`text-xs font-bold ${
                      stat.count === 0 ? 'text-muted-foreground/50' : 'text-primary'
                    }`}>
                      {stat.letter.toUpperCase()}
                    </div>
                  </div>
                  
                  {/* Horizontal Bar */}
                  <div className="flex-1 h-4 rounded-sm relative overflow-hidden bg-muted/20">
                    {stat.count > 0 && (
                      <>
                        {/* Worst Segment (leftmost - largest) */}
                        <div 
                          className="absolute top-0 left-0 bottom-0 bg-red-400 transition-opacity duration-200 rounded-r-sm"
                          style={{ 
                            width: `${(stat.worst / maxReactionTime) * 100}%`,
                            opacity: getOpacity('worst')
                          }}
                          title={`Worst: ${stat.worst}ms`}
                        ></div>
                        
                        {/* Average Segment (middle) */}
                        <div 
                          className="absolute top-0 left-0 bottom-0 bg-blue-400 transition-opacity duration-200 rounded-r-sm"
                          style={{ 
                            width: `${(stat.average / maxReactionTime) * 100}%`,
                            opacity: getOpacity('average')
                          }}
                          title={`Average: ${stat.average}ms`}
                        ></div>
                        
                        {/* Best Segment (rightmost - smallest) */}
                        <div 
                          className="absolute top-0 left-0 bottom-0 bg-green-400 transition-opacity duration-200 rounded-r-sm"
                          style={{ 
                            width: `${(stat.best / maxReactionTime) * 100}%`,
                            opacity: getOpacity('best')
                          }}
                          title={`Best: ${stat.best}ms`}
                        ></div>
                      </>
                    )}
                  </div>
                  
                  {/* Count */}
                  {stat.count > 0 && (
                    <div className="w-8 text-xs text-muted-foreground text-right">
                      {stat.count}×
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: N-Z */}
          <div className="flex-1">
            <div className="text-center mb-2 text-sm font-semibold text-primary">N-Z</div>
            <div className="space-y-1">
              {rightLetters.map((stat) => (
                <div key={stat.letter} className="flex items-center gap-2">
                  {/* Count */}
                  {stat.count > 0 && (
                    <div className="w-8 text-xs text-muted-foreground text-left">
                      {stat.count}×
                    </div>
                  )}
                  
                  {/* Horizontal Bar */}
                  <div className="flex-1 h-4 rounded-sm relative overflow-hidden bg-muted/20">
                    {stat.count > 0 && (
                      <>
                        {/* Worst Segment (rightmost - largest) */}
                        <div 
                          className="absolute top-0 right-0 bottom-0 bg-red-400 transition-opacity duration-200 rounded-l-sm"
                          style={{ 
                            width: `${(stat.worst / maxReactionTime) * 100}%`,
                            opacity: getOpacity('worst')
                          }}
                          title={`Worst: ${stat.worst}ms`}
                        ></div>
                        
                        {/* Average Segment (middle) */}
                        <div 
                          className="absolute top-0 right-0 bottom-0 bg-blue-400 transition-opacity duration-200 rounded-l-sm"
                          style={{ 
                            width: `${(stat.average / maxReactionTime) * 100}%`,
                            opacity: getOpacity('average')
                          }}
                          title={`Average: ${stat.average}ms`}
                        ></div>
                        
                        {/* Best Segment (leftmost - smallest) */}
                        <div 
                          className="absolute top-0 right-0 bottom-0 bg-green-400 transition-opacity duration-200 rounded-l-sm"
                          style={{ 
                            width: `${(stat.best / maxReactionTime) * 100}%`,
                            opacity: getOpacity('best')
                          }}
                          title={`Best: ${stat.best}ms`}
                        ></div>
                      </>
                    )}
                  </div>
                  
                  {/* Letter Label */}
                  <div className="w-6 text-center">
                    <div className={`text-xs font-bold ${
                      stat.count === 0 ? 'text-muted-foreground/50' : 'text-primary'
                    }`}>
                      {stat.letter.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
        <div className="text-center">
          <div className="text-lg font-semibold text-green-400">
            {Math.min(...letterStats.map(s => s.best).filter(b => b > 0))}ms
          </div>
          <div className="text-sm text-muted-foreground">{t('results.charts.horizontalChart.best')}</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-400">
            {Math.round(letterStats.filter(s => s.count > 0).reduce((sum, s) => sum + s.average, 0) / letterStats.filter(s => s.count > 0).length)}ms
          </div>
          <div className="text-sm text-muted-foreground">{t('results.charts.horizontalChart.average')}</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-red-400">
            {Math.max(...letterStats.map(s => s.worst))}ms
          </div>
          <div className="text-sm text-muted-foreground">{t('results.charts.horizontalChart.worst')}</div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalLetterChart;
