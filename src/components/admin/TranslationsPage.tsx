"use client";

import React from "react";
import { useState } from "react";
import { Languages, Upload, Check, X, Clock, FileText } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const requestsData = [
  {
    id: "TR-2025-001",
    document: "Research Partnership Agreement",
    sourceLang: "English",
    targetLang: "Spanish",
    requester: "Dr. Martinez",
    submittedDate: "2025-10-03",
    status: "pending",
    timeline: [
      { status: "submitted", date: "2025-10-03 14:30", completed: true },
      { status: "in-review", date: "", completed: false },
      { status: "translation", date: "", completed: false },
      { status: "quality-check", date: "", completed: false },
      { status: "approved", date: "", completed: false },
    ],
  },
  {
    id: "TR-2025-002",
    document: "Student Exchange MOU",
    sourceLang: "French",
    targetLang: "English",
    requester: "Prof. Dubois",
    submittedDate: "2025-10-02",
    status: "in-progress",
    timeline: [
      { status: "submitted", date: "2025-10-02 10:15", completed: true },
      { status: "in-review", date: "2025-10-02 14:30", completed: true },
      { status: "translation", date: "2025-10-03 09:00", completed: true },
      { status: "quality-check", date: "", completed: false },
      { status: "approved", date: "", completed: false },
    ],
  },
  {
    id: "TR-2025-003",
    document: "Joint Research Proposal",
    sourceLang: "German",
    targetLang: "English",
    requester: "Dr. Schmidt",
    submittedDate: "2025-10-01",
    status: "completed",
    timeline: [
      { status: "submitted", date: "2025-10-01 11:00", completed: true },
      { status: "in-review", date: "2025-10-01 13:30", completed: true },
      { status: "translation", date: "2025-10-02 09:00", completed: true },
      { status: "quality-check", date: "2025-10-02 16:00", completed: true },
      { status: "approved", date: "2025-10-03 10:00", completed: true },
    ],
  },
];

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Arabic",
  "Portuguese",
  "Italian",
  "Russian",
];

export function TranslationsPage() {
  const [activeTab, setActiveTab] = useState("requests");

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
      pending: { variant: "secondary", label: "Pending Review" },
      "in-progress": { variant: "outline", label: "In Progress" },
      completed: { variant: "default", label: "Completed" },
      rejected: { variant: "destructive", label: "Rejected" },
    };
    const config = variants[status] || { variant: "outline" as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTimelineStepLabel = (status: string) => {
    const labels: Record<string, string> = {
      submitted: "Submitted",
      "in-review": "In Review",
      translation: "Translation",
      "quality-check": "Quality Check",
      approved: "Approved",
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1>Translation Confirmation Requests</h1>
        <p className="text-muted-foreground mt-1">
          Submit and track document translation requests
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="requests">All Requests</TabsTrigger>
          <TabsTrigger value="submit">Submit New Request</TabsTrigger>
        </TabsList>

        {/* All Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          {requestsData.map((request) => (
            <Card key={request.id} className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Languages className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1">{request.document}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {request.sourceLang} → {request.targetLang}
                    </p>
                    <div className="flex gap-4 text-sm">
                      <span className="text-muted-foreground">
                        ID: {request.id}
                      </span>
                      <span className="text-muted-foreground">
                        Requester: {request.requester}
                      </span>
                      <span className="text-muted-foreground">
                        Submitted: {request.submittedDate}
                      </span>
                    </div>
                  </div>
                </div>
                {getStatusBadge(request.status)}
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="flex justify-between">
                  {request.timeline.map((step, index) => (
                    <div key={step.status} className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          step.completed
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step.completed ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>
                      <p className="text-sm text-center mb-1">
                        {getTimelineStepLabel(step.status)}
                      </p>
                      {step.date && (
                        <p className="text-xs text-muted-foreground text-center">
                          {step.date}
                        </p>
                      )}
                      {index < request.timeline.length - 1 && (
                        <div
                          className={`absolute top-5 h-0.5 ${
                            step.completed ? "bg-primary" : "bg-muted"
                          }`}
                          style={{
                            left: `${(index / (request.timeline.length - 1)) * 100}%`,
                            right: `${100 - ((index + 1) / (request.timeline.length - 1)) * 100}%`,
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              {request.status === "pending" && (
                <div className="flex gap-2 mt-6">
                  <Button size="sm" variant="default">
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button size="sm" variant="destructive">
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button size="sm" variant="outline" className="ml-auto">
                    <FileText className="w-4 h-4 mr-2" />
                    View Document
                  </Button>
                </div>
              )}
              {request.status === "completed" && (
                <div className="flex gap-2 mt-6">
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Download Original
                  </Button>
                  <Button size="sm" variant="default" className="ml-auto">
                    <FileText className="w-4 h-4 mr-2" />
                    Download Translation
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </TabsContent>

        {/* Submit New Request Tab */}
        <TabsContent value="submit">
          <Card className="p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Languages className="w-8 h-8 text-primary" />
                </div>
                <h2>Submit Translation Request</h2>
                <p className="text-muted-foreground mt-2">
                  Fill out the form below to request a document translation
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="document-title">Document Title</Label>
                  <Input
                    id="document-title"
                    placeholder="Enter document title"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Document Upload</Label>
                  <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, DOC, DOCX up to 10MB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="source-lang">Source Language</Label>
                    <Select>
                      <SelectTrigger id="source-lang" className="mt-2">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang} value={lang.toLowerCase()}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="target-lang">Target Language</Label>
                    <Select>
                      <SelectTrigger id="target-lang" className="mt-2">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang} value={lang.toLowerCase()}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="requester">Requester Name</Label>
                  <Input
                    id="requester"
                    placeholder="Your full name"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special instructions or context for the translation"
                    className="mt-2 min-h-24"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setActiveTab("requests")}
                  >
                    Cancel
                  </Button>
                  <Button className="flex-1 bg-primary">
                    <Languages className="w-4 h-4 mr-2" />
                    Submit Request
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}